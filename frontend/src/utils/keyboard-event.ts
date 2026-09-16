export const keyboardEvent =
	(key: string, fn: () => void) => (event: React.KeyboardEvent) => {
		if (event.key !== key) return

		event.preventDefault()
		fn()
	}
