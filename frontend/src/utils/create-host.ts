import type { RoomId } from '../types/types'

const storageKey = (roomId: RoomId) => `room-creator-token:${roomId}`

/**
 * Сохраняет creatorToken комнаты в localStorage - им подтверждается,
 * что удалить эту комнату может именно этот браузер (создатель).
 */
export function createHost(roomId: RoomId, creatorToken: string): void {
	window.localStorage.setItem(storageKey(roomId), creatorToken)
}

export function getCreatorToken(roomId: RoomId): string | null {
	return window.localStorage.getItem(storageKey(roomId))
}
