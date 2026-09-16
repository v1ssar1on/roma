import { createRoomId } from '../utils/create-room-id'
import { createHost } from '../utils/create-host'
import { createRoom as createRoomRequest } from '../api/rooms'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

// create new room
export async function useCreateRoom(name: string | undefined) {
	const roomId = createRoomId()
	const navigate = useNavigate()

	try {
		const { creatorToken } = await createRoomRequest(roomId, name)
		createHost(roomId, creatorToken)
		navigate(`room/${roomId}`)
		toast.success(`Новая комната создана: ${roomId}`)
	} catch {
		toast.error('Не удалось создать комнату, попробуй ещё раз')
	}
}
