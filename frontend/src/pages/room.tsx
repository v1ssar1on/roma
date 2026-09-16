import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { AudioControllers } from '../components/audio-controllers'

import { useStream } from '../hooks/use-stream'
import { useRoomConnection } from '../hooks/use-room-connection'
import { UserCard } from '@/components/user-card'
import { RoomHeader } from '@/components/room-header'
import { MessageScrollbar } from '@/components/message-scrollbar'
import { useDisclosure } from '@/hooks/use-disclosure'

export const Room = () => {
	const { isOpen: open, onClose } = useDisclosure()
	const { roomId } = useParams()
	const navigate = useNavigate()
	const { stream, muted, muteToggleMicrophone } = useStream()
	// peers
	const { peerId, remoteStreams, roomNotFound } = useRoomConnection(
		roomId,
		stream,
	)
	const [outputMuted, setOutputMuted] = useState(false)

	useEffect(() => {
		if (!roomNotFound) return

		toast.error('Такой комнаты не существует')
		navigate('/')
	}, [roomNotFound, navigate])

	function toggleOutputMute() {
		setOutputMuted((prev) => !prev)
	}

	// peer ids
	const participantIds = [peerId, ...Object.keys(remoteStreams)].filter(
		(id): id is string => Boolean(id),
	)
	const gridColumns = Math.max(1, Math.ceil(Math.sqrt(participantIds.length)))

	return (
		<div className='flex h-svh flex-col bg-background p-2 sm:p-4'>
			<RoomHeader roomId={roomId} participantIds={participantIds} />

			<div
				className='grid h-full w-full auto-rows-fr gap-2 sm:gap-3 py-4'
				style={{
					gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
				}}
			>
				<AnimatePresence>
					{participantIds.map((participantId) => (
						<motion.div
							key={participantId}
							layout
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.25, ease: 'easeOut' }}
						>
							<UserCard
								participantId={participantId}
								peerId={peerId}
								muted={muted}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<MessageScrollbar
				open={open}
				onOpenChange={onClose}
				ready={Boolean(peerId)}
			/>

			<AudioControllers
				muted={muted}
				onToggleChat={onClose}
				onToggleMute={muteToggleMicrophone}
				outputMuted={outputMuted}
				onToggleOutputMute={toggleOutputMute}
			/>

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
