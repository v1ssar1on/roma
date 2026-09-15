import { useEffect, useState } from 'react'

export const useStream = () => {
	const [stream, setStream] = useState<MediaStream | undefined>()
	const [isMuted, setIsMuted] = useState<boolean>(true)

	useEffect(() => {
		async function getMediaDevices() {
			const [userMedia] = await Promise.all([
				navigator.mediaDevices.getUserMedia({
					audio: true,
				}),
				// navigator.mediaDevices.getDisplayMedia({
				// 	video: true,
				// 	audio: true,
				// }),
			])

			userMedia.getAudioTracks().forEach((track) => {
				track.enabled = false
			})

			setStream(userMedia)
		}

		getMediaDevices()
	}, [])

	function muteToggleMicrophone() {
		setIsMuted((prev) => {
			const next = !prev
			stream?.getAudioTracks().forEach((track) => {
				track.enabled = !next
			})
			return next
		})
	}

	return { stream, muted: isMuted, muteToggleMicrophone }
}
