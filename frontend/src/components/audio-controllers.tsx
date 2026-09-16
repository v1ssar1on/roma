import {
	Check,
	Copy,
	MessagesCircle,
	Mic,
	MicOff,
	Speech,
	Volume2,
	VolumeX,
} from 'lucide-react'

import { useState } from 'react'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { usePermissions } from '@/hooks/use-permissions'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'
import { cn } from '@/lib/utils'

interface AudioControllersProps {
	muted: boolean
	onToggleMute: () => void

	outputMuted: boolean
	onToggleOutputMute: () => void

	onToggleChat: () => void
}

// timeout milliseconds
const TIMEOUT_DURATION = 2000

export const AudioControllers = ({
	muted,
	onToggleMute,
	outputMuted,
	onToggleOutputMute,
	onToggleChat,
}: AudioControllersProps) => {
	const { microphoneDenied } = usePermissions()
	const [isCopied, setIsCopied] = useState<boolean>(false)
	const { transcript, listening } = useSpeechRecognition()
	const stopListening = SpeechRecognition.stopListening

	function handleCopyRoomId() {
		navigator.clipboard.writeText(window.location.href)
		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, TIMEOUT_DURATION)
	}

	function handleToggleMute() {
		if (!muted) {
			stopListening()
		}

		onToggleMute()
	}

	function handleToggleListening() {
		listening
			? stopListening()
			: SpeechRecognition.startListening({
					continuous: true,
					language: 'ru-RU',
				})
	}

	return (
		<div className='relative'>
			<ul className='absolute max-w-100 w-full flex flex-col'>{transcript}</ul>
			<div className='flex justify-center pb-2'>
				<div className='rounded-xl border border-border bg-card px-3 py-2 shadow-lg'>
					<div className='flex items-center gap-2'>
						<Tooltip>
							<TooltipTrigger
								render={
									<Button
										focusableWhenDisabled
										disabled={microphoneDenied || muted}
										onClick={handleToggleListening}
										variant={listening ? 'destructive' : 'outline'}
										className={cn(listening && 'animate-pulse')}
									>
										<Speech />
									</Button>
								}
							/>
							<TooltipContent>
								{microphoneDenied || muted
									? 'Нужно включить микрофон/дать разрешение микрофона'
									: 'Распознование речи'}{' '}
							</TooltipContent>
						</Tooltip>

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
										onClick={handleToggleMute}
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

						<Tooltip>
							<TooltipTrigger
								render={
									<Button onClick={onToggleChat} size='xl' variant={'outline'}>
										<MessagesCircle />
									</Button>
								}
							/>
							<TooltipContent>Открыть/Закрыть чат</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	)
}
