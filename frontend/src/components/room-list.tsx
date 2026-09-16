import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Users } from 'lucide-react'
import { listRooms, type RoomListItem } from '@/api/rooms'
import { Card } from '@/ui/card'

const POLL_INTERVAL = 5000

export const RoomList = () => {
	const navigate = useNavigate()
	const [rooms, setRooms] = useState<RoomListItem[] | null>(null)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		let cancelled = false

		async function load() {
			try {
				const data = await listRooms()
				if (!cancelled) {
					setRooms(data)
					setFailed(false)
				}
			} catch {
				if (!cancelled) setFailed(true)
			}
		}

		load()
		const interval = setInterval(load, POLL_INTERVAL)

		return () => {
			cancelled = true
			clearInterval(interval)
		}
	}, [])

	if (rooms === null && !failed) {
		return (
			<Card className='flex w-full flex-row items-center justify-center gap-2 p-4 text-sm text-muted-foreground'>
				<Loader2 className='size-4 animate-spin' />
				Загружаем комнаты...
			</Card>
		)
	}

	if (failed) {
		return (
			<Card className='w-full p-4 text-center text-sm text-muted-foreground'>
				Не удалось загрузить список комнат
			</Card>
		)
	}

	if (rooms!.length === 0) {
		return (
			<Card className='w-full p-4 text-center text-sm text-muted-foreground'>
				Активных комнат пока нет
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
