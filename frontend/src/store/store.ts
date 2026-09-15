import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RoomId } from '../types/types'

interface UserState {
	name: string | undefined
	lastRoomId: RoomId | undefined
}

interface UserActions {
	setName: (name: string) => void
	setLastRoomId: (roomId: RoomId) => void
}

export const useSettingsStore = create<UserState & UserActions>()(
	persist(
		(set) => ({
			name: undefined,
			lastRoomId: undefined,
			setName: (name) => set({ name }),
			setLastRoomId: (roomId) => set({ lastRoomId: roomId }),
		}),
		{ name: 'settings' },
	),
)
