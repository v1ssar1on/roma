import { Check, Copy, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

import { useState } from 'react'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { usePermissions } from '@/hooks/use-permissions'

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
	const { microphoneDenied } = usePermissions()
	const [isCopied, setIsCopied] = useState<boolean>(false)

	function handleCopyRoomId() {
		navigator.clipboard.writeText(window.location.href)
		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, TIMEOUT_DURATION)
	}

	return (
		<div className='flex items-center gap-2'>
			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							size='xl'
							variant={isCopied ? 'default' : 'outline'}
							onClick={handleCopyRoomId}
						>
							{isCopied ? <Check /> : <Copy />}
						</Button>
					}
				/>
				<TooltipContent>Скопировать ссылку на комнату</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							disabled={microphoneDenied}
							focusableWhenDisabled
							size='xl'
							variant={muted ? 'outline' : 'default'}
							onClick={onToggleMute}
						>
							{muted ? <MicOff /> : <Mic />}
						</Button>
					}
				/>
				<TooltipContent>Включить/Отключить микрофон</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					render={
						<Button
							size='xl'
							variant={outputMuted ? 'outline' : 'default'}
							onClick={onToggleOutputMute}
						>
							{outputMuted ? <VolumeX /> : <Volume2 />}
						</Button>
					}
				/>
				<TooltipContent>Включить/Выключить звук</TooltipContent>
			</Tooltip>
		</div>
	)
}
