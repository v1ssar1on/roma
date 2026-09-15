import { Avatar, AvatarBadge, AvatarFallback } from '@/ui/avatar'
import { Card } from '@/ui/card'
import { User } from 'lucide-react'

export const UserCard = ({
	participantId,
	peerId,
	muted,
}: {
	participantId: string
	peerId: string | undefined
	muted: boolean
}) => {
	return (
		<Card
			key={participantId}
			className='flex flex-col items-center gap-3 px-6 py-6'
		>
			<Avatar size='lg'>
				<AvatarFallback>
					<User className='size-5' />
				</AvatarFallback>
				{participantId === peerId && muted && (
					<AvatarBadge className='bg-destructive text-destructive-foreground'>
						<span className='size-1.5 rounded-full bg-current' />
					</AvatarBadge>
				)}
			</Avatar>
			<span className='font-mono text-md text-muted-foreground'>
				{participantId === peerId ? 'Вы' : participantId.slice(0, 6)}
			</span>
		</Card>
	)
}
