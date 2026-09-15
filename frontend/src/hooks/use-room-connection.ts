import { useEffect, useRef, useState } from 'react'
import type {
	PeerLeftPayload,
	RoomId,
	RoomJoinedPayload,
	SignalPayload,
} from '../types/types'
import { ICE_SERVERS, socket } from '../api/socket'
import { useSettingsStore } from '@/store/store'

function isDescription(
	data: SignalPayload['data'],
): data is RTCSessionDescriptionInit {
	return 'type' in data
}

export const useRoomConnection = (
	roomId: RoomId | undefined,
	localStream: MediaStream | undefined,
) => {
	const [peerId, setPeerId] = useState<string>()
	const [remoteStreams, setRemoteStreams] = useState<
		Record<string, MediaStream>
	>({})
	const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
	const { name } = useSettingsStore()

	useEffect(() => {
		if (!roomId || !localStream) return

		const peerConnections = peerConnectionsRef.current

		function createPeerConnection(remotePeerId: string) {
			const peerConnection = new RTCPeerConnection(ICE_SERVERS)

			localStream!.getTracks().forEach((track) => {
				peerConnection.addTrack(track, localStream!)
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
				setRemoteStreams((prev) => ({
					...prev,
					[remotePeerId]: event.streams[0],
				}))
			}

			peerConnections.set(remotePeerId, peerConnection)
			return peerConnection
		}

		function removePeer(remotePeerId: string) {
			peerConnections.get(remotePeerId)?.close()
			peerConnections.delete(remotePeerId)
			setRemoteStreams((prev) => {
				const next = { ...prev }
				delete next[remotePeerId]
				return next
			})
		}

		async function handleRoomJoined({
			peerId: ownId,
			peers,
		}: RoomJoinedPayload) {
			setPeerId(ownId)

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
			connect: () => socket.emit('join-room', { roomId }),
			'room-joined': handleRoomJoined,
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
			setRemoteStreams({})
		}
	}, [roomId, localStream])

	return { peerId, remoteStreams }
}
