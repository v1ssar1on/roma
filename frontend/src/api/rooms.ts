import { WS_URL } from './socket'
import type { RoomId } from '../types/types'

interface CreateRoomResponse {
	roomId: string
	creatorToken: string
}

export async function createRoom(
	roomId: RoomId,
	name?: string,
): Promise<CreateRoomResponse> {
	const response = await fetch(`${WS_URL}/rooms`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ roomId, name }),
	})

	if (!response.ok) {
		throw new Error('Не удалось создать комнату')
	}

	return response.json()
}

export interface RoomListItem {
	roomId: string
	name?: string
	createdAt: string
	totalParticipants: number
	online: number
}

export async function listRooms(): Promise<RoomListItem[]> {
	const response = await fetch(`${WS_URL}/rooms`)

	if (!response.ok) {
		throw new Error('Не удалось получить список комнат')
	}

	return response.json()
}

export async function deleteRoom(
	roomId: RoomId,
	creatorToken: string,
): Promise<void> {
	const response = await fetch(`${WS_URL}/rooms/${roomId}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ creatorToken }),
	})

	if (!response.ok) {
		throw new Error('Не удалось удалить комнату')
	}
}
