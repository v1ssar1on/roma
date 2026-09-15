import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRoomId } from '../utils/create-room-id'
import { createHost } from '../utils/create-host'
import { toast } from 'react-toastify'

export const App = () => {
	const [roomInput, setRoomInput] = useState<string | null>()
	const navigate = useNavigate()

	function openRoom() {
		const roomId = createRoomId()

		createHost(roomId)
		navigate(`room/${roomId}`)
		toast.success(`Новая комната создана: ${roomId}`)
	}

	function handleGoRoom() {
		if (!roomInput) {
			toast.warn('Поле не может быть пустым')
			return
		}

		navigate(`room/${roomInput}`)
	}

	return (
		<div className='flex h-svh items-center justify-center bg-background px-5'>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: 'easeOut' }}
				className='w-full max-w-sm'
			>
				<Card className='w-full items-start gap-6 p-7'>
					<div className='flex flex-col gap-1'>
						<span className='text-xs font-medium tracking-widest text-muted-foreground uppercase'>
							Voice Rooms
						</span>
						<CardTitle className='text-2xl'>Войти в комнату</CardTitle>
					</div>

					<div className='flex w-full flex-col gap-2'>
						<Label htmlFor='room-id'>ID комнаты</Label>
						<Input
							id='room-id'
							placeholder='lnlvmjqype'
							onChange={(e) => setRoomInput(e.target.value)}
							className='h-10 w-full font-mono text-base tracking-wide'
							type='text'
						/>
					</div>

					<div className='flex w-full flex-col gap-2'>
						<Button onClick={handleGoRoom} className='w-full justify-between'>
							Присоединиться
							<ArrowRight className='size-4' />
						</Button>
						<Button variant='outline' onClick={openRoom} className='w-full'>
							Создать новую комнату
						</Button>
					</div>
				</Card>
			</motion.div>
		</div>
	)
}
