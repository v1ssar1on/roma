import { create } from 'zustand'
import { toast } from 'sonner'
import type {
	PeerLeftPayload,
	RoomId,
	RoomJoinedPayload,
	SignalPayload,
} from '../types/types'
import { ICE_SERVERS, socket } from '../api/socket'
import { playSound } from '@/utils/play-sound'
import { joinSound, leaveSound } from '@/lib/sounds'

function isDescription(
	data: SignalPayload['data'],
): data is RTCSessionDescriptionInit {
	return 'type' in data
}

interface RoomState {
	peerId: string | undefined
	remoteStreams: Record<string, MediaStream>
	roomNotFound: boolean
	peerConnections: Map<string, RTCPeerConnection>
	connect: (
		roomId: RoomId,
		localStream: MediaStream,
		name: string | undefined,
	) => () => void
}

export const useRoomStore = create<RoomState>((set, get) => ({
	peerId: undefined,
	remoteStreams: {},
	roomNotFound: false,
	peerConnections: new Map(),

	connect: (roomId, localStream, name) => {
		const peerConnections = get().peerConnections

		function createPeerConnection(remotePeerId: string) {
			const peerConnection = new RTCPeerConnection(ICE_SERVERS)

			localStream.getTracks().forEach((track) => {
				peerConnection.addTrack(track, localStream)
			})

			peerConnection.onicecandidate = (event) => {
				if (!event.candidate) return

				const candidateWithName = {
					...event.candidate.toJSON(),
					username: name,
				}

				socket.emit('signal', {
					to: remotePeerId,
					data: candidateWithName,
				})
			}

			peerConnection.ontrack = (event) => {
				set((state) => ({
					remoteStreams: {
						...state.remoteStreams,
						[remotePeerId]: event.streams[0],
					},
				}))
			}

			peerConnections.set(remotePeerId, peerConnection)
			return peerConnection
		}

		function removePeer(remotePeerId: string) {
			peerConnections.get(remotePeerId)?.close()
			peerConnections.delete(remotePeerId)
			set((state) => {
				const next = { ...state.remoteStreams }
				delete next[remotePeerId]
				return { remoteStreams: next }
			})
			playSound(leaveSound)
		}

		async function handleRoomJoined({
			peerId: ownId,
			peers,
		}: RoomJoinedPayload) {
			set({ peerId: ownId })

			for (const remotePeerId of peers) {
				const peerConnection = createPeerConnection(remotePeerId)
				const offer = await peerConnection.createOffer()
				await peerConnection.setLocalDescription(offer)
				socket.emit('signal', { to: remotePeerId, data: offer })
			}
		}

		async function handleSignal({ from, data }: SignalPayload) {
			let peerConnection = peerConnections.get(from)

			if (isDescription(data)) {
				if (data.type === 'offer') {
					peerConnection ??= createPeerConnection(from)
					await peerConnection.setRemoteDescription(data)
					const answer = await peerConnection.createAnswer()
					await peerConnection.setLocalDescription(answer)
					socket.emit('signal', { to: from, data: answer })
				} else if (data.type === 'answer') {
					await peerConnection?.setRemoteDescription(data)
				}
			} else {
				await peerConnection?.addIceCandidate(data)
			}
		}

		const listeners = {
			connect: () => socket.emit('join-room', { roomId, name }),
			'room-joined': handleRoomJoined,
			'room-not-found': () => {
				toast.error('Такой комнаты не существует')
				set({ roomNotFound: true })
			},
			'peer-joined': () => playSound(joinSound),
			'peer-left': ({ peerId: remotePeerId }: PeerLeftPayload) =>
				removePeer(remotePeerId),
			signal: handleSignal,
		}

		for (const [event, handler] of Object.entries(listeners)) {
			socket.on(event, handler)
		}

		socket.connected ? listeners.connect() : socket.connect()

		return () => {
			for (const [event, handler] of Object.entries(listeners)) {
				socket.off(event, handler)
			}
			socket.disconnect()
			peerConnections.forEach((peerConnection) => peerConnection.close())
			peerConnections.clear()
			set({ remoteStreams: {}, peerId: undefined, roomNotFound: false })
		}
	},
}))
