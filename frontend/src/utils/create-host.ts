import type { RoomId } from '../types/types'

export function createHost(roomId: RoomId): void {
	window.localStorage.setItem(roomId, '*')
}
