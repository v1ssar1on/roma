import { Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

import { toast } from 'sonner'
import { useSettingsStore } from '@/store/store'
import { Card, CardTitle } from '@/ui/card'
import { Label } from '@/ui/label'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { RoomList } from '@/components/room-list'
import { useCreateRoom } from '@/hooks/use-create-room'

export const App = () => {
	const [roomInput, setRoomInput] = useState<string | null>()
	const navigate = useNavigate()
	const { name, setName } = useSettingsStore()

	// go to created room
	function handleGoRoom() {
		if (!roomInput) {
			toast.warning('Поле не может быть пустым')
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
							Roma
						</span>
						<CardTitle className='text-2xl'>Войти в комнату</CardTitle>
					</div>

					<div className='flex w-full flex-col gap-2'>
						<Label htmlFor='username'>Имя пользователя</Label>
						<Input
							id='username'
							defaultValue={name}
							placeholder='Romario'
							onChange={(e) => setName(e.target.value)}
							className='h-10 w-full font-mono text-base tracking-wide'
							type='text'
						/>
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
						<Button onClick={handleGoRoom} className='w-full justify-center'>
							Присоединиться
							<ArrowRight className='size-4' />
						</Button>
						<Button
							variant='outline'
							onClick={() => useCreateRoom(name)}
							className='w-full'
						>
							Создать новую комнату
						</Button>
					</div>
				</Card>

				<div className='mt-6 flex w-full flex-col gap-2'>
					<span className='text-xs font-medium tracking-widest text-muted-foreground uppercase'>
						Активные комнаты
					</span>
					<Suspense fallback={<div>Loading...</div>}>
						<RoomList />
					</Suspense>
				</div>
			</motion.div>
		</div>
	)
}
