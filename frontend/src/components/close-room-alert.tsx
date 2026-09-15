import {
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogTrigger,
	AlertDialog,
} from '@/ui/alert'
import type { ReactElement } from 'react'

type CloseRoomAlertProps = {
	trigger: ReactElement
	onConfirm: () => void
}

export const CloseRoomAlert = ({ trigger, onConfirm }: CloseRoomAlertProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger render={trigger} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Покинуть комнату?</AlertDialogTitle>
					<AlertDialogDescription>
						Соединение с остальными участниками будет разорвано.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Выйти</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
