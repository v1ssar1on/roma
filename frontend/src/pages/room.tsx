import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, User } from 'lucide-react'
import { AudioControllers } from '../components/audio-controllers'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useStream } from '../hooks/use-stream'
import { useRoomConnection } from '../hooks/use-room-connection'

export const Room = () => {
	const { roomId } = useParams()
	const { stream, muted, muteToggleMicrophone } = useStream()
	const { peerId, remoteStreams } = useRoomConnection(roomId, stream)
	const [outputMuted, setOutputMuted] = useState(false)
	const navigate = useNavigate()

	function toggleOutputMute() {
		setOutputMuted((prev) => !prev)
	}

	console.log(peerId)

	const participantIds = [peerId, ...Object.keys(remoteStreams)].filter(
		(id): id is string => Boolean(id),
	)

	return (
		<div className='flex h-svh flex-col bg-background p-4'>
			<header className='flex items-center justify-between relative'>
				<Button variant='ghost' size='icon' onClick={() => navigate('/')}>
					<ArrowLeft className='size-4' />
				</Button>

				<div className='flex absolute left-1/2 transform-[translateX(-50%)] items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5'>
					<span className='size-1.5 rounded-full bg-emerald-400' />
					<span className='font-mono text-xs text-muted-foreground'>
						{roomId}
					</span>
				</div>

				<span className='font-mono text-xs text-muted-foreground'>
					Количество участников: {participantIds.length}
				</span>
			</header>

			<div className='flex flex-1 items-center justify-center'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className='grid grid-cols-3 gap-4 sm:grid-cols-4'
				>
					{participantIds.map((participantId) => (
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
							<span className='font-mono text-xs text-muted-foreground'>
								{participantId === peerId ? 'Вы' : participantId.slice(0, 6)}
							</span>
						</Card>
					))}
				</motion.div>
			</div>

			<footer className='flex justify-center pb-2'>
				<div className='rounded-full border border-border bg-card px-3 py-2 shadow-lg'>
					<AudioControllers
						muted={muted}
						onToggleMute={muteToggleMicrophone}
						outputMuted={outputMuted}
						onToggleOutputMute={toggleOutputMute}
					/>
				</div>
			</footer>

			{Object.entries(remoteStreams).map(([remotePeerId, remoteStream]) => (
				<audio
					key={remotePeerId}
					ref={(audio) => {
						if (audio) audio.srcObject = remoteStream
					}}
					muted={outputMuted}
					autoPlay
				/>
			))}
		</div>
	)
}
