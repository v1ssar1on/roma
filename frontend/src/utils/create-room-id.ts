import { customAlphabet } from 'nanoid'
import type { RoomId } from '../types/types'

export function createRoomId(): RoomId {
	const nanoid = customAlphabet('abcdefghijklmnopqrstuvxyz', 10)
	return nanoid()
}
