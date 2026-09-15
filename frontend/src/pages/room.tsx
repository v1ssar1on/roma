import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { AudioControllers } from '../components/audio-controllers'

import { useStream } from '../hooks/use-stream'
import { useRoomConnection } from '../hooks/use-room-connection'
import { UserCard } from '@/components/user-card'
import { RoomHeader } from '@/components/room-header'

export const Room = () => {
	const { roomId } = useParams()
	const { stream, muted, muteToggleMicrophone } = useStream()
	// peers
	const { peerId, remoteStreams } = useRoomConnection(roomId, stream)
	const [outputMuted, setOutputMuted] = useState(false)

	function toggleOutputMute() {
		setOutputMuted((prev) => !prev)
	}

	// peer ids
	const participantIds = [peerId, ...Object.keys(remoteStreams)].filter(
		(id): id is string => Boolean(id),
	)

	return (
		<div className='flex h-svh flex-col bg-background p-4'>
			<RoomHeader roomId={roomId} participantIds={participantIds} />

			<div className='flex flex-1 items-center justify-center'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className='grid grid-cols-3 gap-4 sm:grid-cols-4'
				>
					{participantIds.map((participantId) => (
						<UserCard
							key={participantId}
							participantId={participantId}
							peerId={peerId}
							muted={muted}
						/>
					))}
				</motion.div>
			</div>

			<footer className='flex justify-center pb-2'>
				<div className='rounded-xl border border-border bg-card px-3 py-2 shadow-lg'>
					<AudioControllers
						muted={muted}
						onToggleMute={muteToggleMicrophone}
						outputMuted={outputMuted}
						onToggleOutputMute={toggleOutputMute}
					/>
				</div>
			</footer>
		</div>
	)
}
