import { Button } from '@/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CloseRoomAlert } from './close-room-alert'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

export const RoomHeader = ({
	roomId,
	participantIds,
}: {
	roomId: string | undefined
	participantIds: string[]
}) => {
	const navigate = useNavigate()

	return (
		<header className='flex items-center justify-between relative'>
			<Tooltip>
				<CloseRoomAlert
					trigger={
						<TooltipTrigger
							render={
								<Button variant='ghost' size='xl'>
									<ArrowLeft className='size-4' />
								</Button>
							}
						/>
					}
					onConfirm={() => navigate('/')}
				/>
				<TooltipContent>Вернуться на главную</TooltipContent>
			</Tooltip>

			<div className='flex absolute left-1/2 transform-[translateX(-50%)] items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5'>
				<span className='size-1.5 rounded-full bg-emerald-400' />
				<span className='font-mono text-sm text-muted-foreground'>
					{roomId}
				</span>
			</div>

			<span className='font-mono text-sm text-muted-foreground'>
				Количество участников: {participantIds.length}
			</span>
		</header>
	)
}
