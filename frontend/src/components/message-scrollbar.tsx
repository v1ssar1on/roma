import { useEffect, useState } from 'react'
import { Send, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/ui/avatar'
import { Bubble, BubbleContent } from '@/ui/bubble'
import { Message, MessageAvatar, MessageContent } from '@/ui/message'
import {
	MessageScrollerProvider,
	MessageScrollerViewport,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerButton,
	MessageScroller,
} from '@/ui/message-scroller'
import { Field, FieldLabel } from '@/ui/field'
import { Textarea } from '@/ui/textarea'
import { Button } from '@/ui/button'
import { keyboardEvent } from '@/utils/keyboard-event'
import { socket } from '@/api/socket'
import { useSettingsStore } from '@/store/store'
import type { MessagePayload } from '@/types/types'

export const MessageScrollbar = ({ ready }: { ready: boolean }) => {
	const { name } = useSettingsStore()
	const [messages, setMessages] = useState<MessagePayload[]>([])
	const [inputValue, setInputValue] = useState<string | null>()

	useEffect(() => {
		function handleHistory(history: MessagePayload[]) {
			setMessages(history)
		}

		function handleNewMessage(message: MessagePayload) {
			setMessages((prev) => [...prev, message])
		}

		socket.on('message-history', handleHistory)
		socket.on('new-message', handleNewMessage)

		return () => {
			socket.off('message-history', handleHistory)
			socket.off('new-message', handleNewMessage)
		}
	}, [])

	function handleSendMessage() {
		if (!inputValue?.trim()) return

		socket.emit('send-message', { text: inputValue.trim() })
		setInputValue('')
	}

	return (
		<MessageScrollerProvider>
			<div className='flex h-full min-h-0 flex-col gap-2 px-2 pb-2 sm:gap-3 sm:px-4 sm:pb-4'>
				<MessageScroller className='min-h-0 flex-1'>
					<MessageScrollerViewport>
						<MessageScrollerContent className='gap-4 sm:gap-6'>
							{messages.map((message) => {
								const isOwn = message.authorName === name

								return (
									<MessageScrollerItem
										key={message.id}
										messageId={message.id}
										scrollAnchor={isOwn}
									>
										<Message align={isOwn ? 'end' : 'start'}>
											<MessageAvatar className='hidden sm:flex'>
												<Avatar>
													<AvatarFallback>
														<User className='size-4' />
													</AvatarFallback>
												</Avatar>
											</MessageAvatar>
											<MessageContent>
												<Bubble
													align={isOwn ? 'end' : 'start'}
													variant={isOwn ? 'default' : 'secondary'}
													className='max-w-[90%] sm:max-w-[80%]'
												>
													<BubbleContent>{message.text}</BubbleContent>
												</Bubble>
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								)
							})}
						</MessageScrollerContent>
					</MessageScrollerViewport>

					<MessageScrollerButton />
				</MessageScroller>

				<Field>
					<FieldLabel htmlFor='textarea-message' className='sr-only'>
						Сообщение
					</FieldLabel>
					<div className='flex items-end gap-2'>
						<Textarea
							onKeyDown={keyboardEvent('Enter', handleSendMessage)}
							className='min-h-12 max-h-32 flex-1 resize-none sm:min-h-16'
							id='textarea-message'
							placeholder={ready ? 'Написать сообщение...' : 'Подключаемся...'}
							value={inputValue ?? ''}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={!ready}
						/>
						<Button
							size='icon'
							onClick={handleSendMessage}
							disabled={!ready || !inputValue}
						>
							<Send className='size-4' />
							<span className='sr-only'>Отправить</span>
						</Button>
					</div>
				</Field>
			</div>
		</MessageScrollerProvider>
	)
}
