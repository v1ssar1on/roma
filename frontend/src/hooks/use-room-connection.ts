import { useEffect } from 'react'
import type { RoomId } from '../types/types'
import { useSettingsStore } from '@/store/store'
import { useRoomStore } from '@/store/room.store'

export const useRoomConnection = (
	roomId: RoomId | undefined,
	localStream: MediaStream | undefined,
) => {
	const { name } = useSettingsStore()
	const connect = useRoomStore((state) => state.connect)
	const peerId = useRoomStore((state) => state.peerId)
	const remoteStreams = useRoomStore((state) => state.remoteStreams)
	const roomNotFound = useRoomStore((state) => state.roomNotFound)

	useEffect(() => {
		if (!roomId || !localStream) return

		return connect(roomId, localStream, name)
	}, [roomId, localStream, name, connect])

	return { peerId, remoteStreams, roomNotFound }
}
