import { Check, Copy, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

interface AudioControllersProps {
	muted: boolean
	onToggleMute: () => void
	outputMuted: boolean
	onToggleOutputMute: () => void
}

const TIMEOUT_DURATION = 2000

export const AudioControllers = ({
	muted,
	onToggleMute,
	outputMuted,
	onToggleOutputMute,
}: AudioControllersProps) => {
	const { roomId } = useParams()
	const [isCopied, setIsCopied] = useState<boolean>(false)

	function handleCopyRoomId() {
		navigator.clipboard.writeText(roomId!)
		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, TIMEOUT_DURATION)
	}

	return (
		<div className='flex items-center gap-2'>
			<Button
				disabled={isCopied}
				size='icon'
				variant={isCopied ? 'default' : 'outline'}
				onClick={handleCopyRoomId}
			>
				{isCopied ? <Check /> : <Copy />}
			</Button>

			<Button
				size='icon'
				variant={muted ? 'outline' : 'default'}
				onClick={onToggleMute}
			>
				{muted ? <MicOff /> : <Mic />}
			</Button>

			<Button
				size='icon'
				variant={outputMuted ? 'outline' : 'default'}
				onClick={onToggleOutputMute}
			>
				{outputMuted ? <VolumeX /> : <Volume2 />}
			</Button>
		</div>
	)
}
