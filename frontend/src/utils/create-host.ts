import type { RoomId } from '../types/types'

/**
 * Создание хоста в localStorage
 */
export function createHost(roomId: RoomId): void {
	window.localStorage.setItem(roomId, '*')
}
