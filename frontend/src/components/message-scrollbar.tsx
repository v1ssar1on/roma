import { useState } from 'react'
import { nanoid } from 'nanoid'
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

interface TranscriptMessage {
	id: string
	role: 'user' | 'peer'
	text: string
}

const messagesArr: TranscriptMessage[] = Array.from({ length: 11 }, () => [
	{ id: nanoid(), role: 'peer' as const, text: 'Привет! Как слышно?' },
	{ id: nanoid(), role: 'user' as const, text: 'Норм, всё слышно' },
]).flat()

export const MessageScrollbar = () => {
	const [messages, setMessages] = useState(messagesArr)
	const [inputValue, setInputValue] = useState<string | null>()

	function handleSendMessage() {
		if (!inputValue?.trim()) return

		setMessages((prev) => [
			...prev,
			{ id: nanoid(), role: 'user', text: inputValue },
		])
		setInputValue('')
	}

	return (
		<MessageScrollerProvider>
			<div className='flex h-full min-h-0 flex-col gap-2 px-2 pb-2 sm:gap-3 sm:px-4 sm:pb-4'>
				<MessageScroller className='min-h-0 flex-1'>
					<MessageScrollerViewport>
						<MessageScrollerContent className='gap-4 sm:gap-6'>
							{messages.map((message) => (
								<MessageScrollerItem
									key={message.id}
									messageId={message.id}
									scrollAnchor={message.role === 'user'}
								>
									<Message align={message.role === 'user' ? 'end' : 'start'}>
										<MessageAvatar className='hidden sm:flex'>
											<Avatar>
												<AvatarFallback>
													<User className='size-4' />
												</AvatarFallback>
											</Avatar>
										</MessageAvatar>
										<MessageContent>
											<Bubble
												align={message.role === 'user' ? 'end' : 'start'}
												variant={
													message.role === 'user' ? 'default' : 'secondary'
												}
												className='max-w-[90%] sm:max-w-[80%]'
											>
												<BubbleContent>{message.text}</BubbleContent>
											</Bubble>
										</MessageContent>
									</Message>
								</MessageScrollerItem>
							))}
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
							placeholder='Написать сообщение...'
							value={inputValue ?? ''}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<Button
							size='icon'
							onClick={handleSendMessage}
							disabled={!inputValue}
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
