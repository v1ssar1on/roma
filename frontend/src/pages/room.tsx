import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AudioControllers } from '../components/audio-controllers'

import { useStream } from '../hooks/use-stream'
import { useRoomConnection } from '../hooks/use-room-connection'
import { useMediaQuery } from '../hooks/use-media-query'
import { UserCard } from '@/components/user-card'
import { RoomHeader } from '@/components/room-header'
import { MessageScrollbar } from '@/components/message-scrollbar'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/ui/resizable'

export const Room = () => {
	const { roomId } = useParams()
	const { stream, muted, muteToggleMicrophone } = useStream()
	// peers
	const { peerId, remoteStreams } = useRoomConnection(roomId, stream)
	const [outputMuted, setOutputMuted] = useState(false)
	const isMobile = useMediaQuery('(max-width: 639px)')

	function toggleOutputMute() {
		setOutputMuted((prev) => !prev)
	}

	// peer ids
	const participantIds = [peerId, ...Object.keys(remoteStreams)].filter(
		(id): id is string => Boolean(id),
	)
	// чем больше участников, тем больше колонок и мельче плитки
	const gridColumns = Math.max(1, Math.ceil(Math.sqrt(participantIds.length)))

	return (
		<div className='flex h-svh flex-col bg-background p-2 sm:p-4'>
			<RoomHeader roomId={roomId} participantIds={participantIds} />

			<ResizablePanelGroup
				orientation={isMobile ? 'vertical' : 'horizontal'}
				className='flex flex-1'
			>
				<ResizablePanel
					defaultSize={isMobile ? '55%' : '70%'}
					minSize='25%'
					className='p-2'
				>
					<div
						className='grid h-full w-full auto-rows-fr gap-2 sm:gap-3'
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
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={isMobile ? '45%' : '30%'} minSize='20%'>
					<MessageScrollbar />
				</ResizablePanel>
			</ResizablePanelGroup>

			<AudioControllers
				muted={muted}
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
