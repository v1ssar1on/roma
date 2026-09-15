import { customAlphabet } from 'nanoid'
import type { RoomId } from '../types/types'

/**
 * Создание уникального идентификатора комнаты.
 * @returns {string} nanoid строку.
 */
export function createRoomId(): RoomId {
	const nanoid = customAlphabet('abcdefghijklmnopqrstuvxyz', 10)
	return nanoid()
}
