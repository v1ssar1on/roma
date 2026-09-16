import { useNavigate } from 'react-router-dom'
import { Loader2, Users } from 'lucide-react'
import { roomsFetch, type RoomListItem } from '@/api/rooms'
import { Card } from '@/ui/card'
import { use } from 'react'

export const RoomList = () => {
	const navigate = useNavigate()
	const rooms = use<RoomListItem[]>(roomsFetch())

	if (rooms === null) {
		return (
			<Card className='flex w-full flex-row items-center justify-center gap-2 p-4 text-sm text-muted-foreground'>
				<Loader2 className='size-4 animate-spin' />
				Загружаем комнаты...
			</Card>
		)
	}

	if (Boolean(!rooms.length)) {
		return (
			<Card className='w-full p-4 text-center text-sm text-muted-foreground'>
				Нет созданных комнат
			</Card>
		)
	}

	return (
		<Card className='w-full gap-0 divide-y divide-border p-0'>
			{rooms!.map((room) => (
				<button
					key={room.roomId}
					onClick={() => navigate(`room/${room.roomId}`)}
					className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted'
				>
					<div className='flex min-w-0 flex-col gap-0.5'>
						<span className='truncate text-sm font-medium'>
							{room.name || room.roomId}
						</span>
						<span className='truncate font-mono text-xs text-muted-foreground'>
							{room.roomId}
						</span>
					</div>

					<div className='flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground'>
						{room.online > 0 && (
							<span className='size-1.5 rounded-full bg-emerald-400' />
						)}
						<Users className='size-3.5' />
						{room.online}/{room.totalParticipants}
					</div>
				</button>
			))}
		</Card>
	)
}
