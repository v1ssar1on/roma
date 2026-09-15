import { useEffect, useState } from 'react'

export const usePermissions = () => {
	const [permissions, setPermissions] = useState<PermissionStatus | undefined>()
	const microphoneDenied = permissions?.state === 'denied'

	useEffect(() => {
		async function getPermissions() {
			const result = await navigator.permissions.query({ name: 'microphone' })

			setPermissions(result)
		}

		getPermissions()
	}, [])

	return { permissions, microphoneDenied }
}
