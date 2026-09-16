import { use } from 'react'

const microphonePermissionPromise = navigator.permissions.query({
	name: 'microphone',
})

export const usePermissions = () => {
	const permissions = use(microphonePermissionPromise)
	return { permissions, microphoneDenied: permissions?.state === 'denied' }
}
