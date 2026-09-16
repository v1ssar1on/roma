import { WS_URL } from './socket'
import type { RoomId } from '../types/types'
import { fetchData } from '@/utils/cache'

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

export function listRooms(): Promise<RoomListItem[]> {
	const rooms = fetch(`${WS_URL}/rooms`)
		.then((response) => {
			if (!response.ok) {
				throw new Error('Не удалось получить список комнат')
			}

			return response.json()
		})
		.catch((err) => {
			throw new Error(err)
		})

	return rooms
}

export const roomsFetch = () => {
	const data = fetchData(`${WS_URL}/rooms`, listRooms)

	return data
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
