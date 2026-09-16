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
			className='@container flex h-full w-full flex-col items-center justify-center gap-2 p-2'
		>
			<Avatar className='size-10 @[100px]:size-12 @[160px]:size-16 @[240px]:size-20 @[340px]:size-24'>
				<AvatarFallback>
					<User className='size-5 @[100px]:size-6 @[160px]:size-8 @[240px]:size-10 @[340px]:size-12' />
				</AvatarFallback>
				{participantId === peerId && muted && (
					<AvatarBadge className='bg-destructive text-destructive-foreground'>
						<span className='size-1.5 rounded-full bg-current' />
					</AvatarBadge>
				)}
			</Avatar>
			<span className='truncate font-mono text-xs text-muted-foreground @[160px]:text-sm @[240px]:text-base'>
				{participantId === peerId ? 'Вы' : participantId.slice(0, 6)}
			</span>
		</Card>
	)
}
