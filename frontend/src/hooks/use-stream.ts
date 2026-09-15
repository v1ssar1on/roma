import { useEffect, useState } from 'react'

export const useStream = () => {
	const [stream, setStream] = useState<MediaStream | undefined>()
	const [isMuted, setIsMuted] = useState<boolean>(true)

	useEffect(() => {
		let activeStream: MediaStream | undefined

		async function getMediaDevices() {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})

			mediaStream.getAudioTracks().forEach((track) => {
				track.enabled = false
			})

			activeStream = mediaStream
			setStream(mediaStream)
		}

		getMediaDevices()

		return () => {
			activeStream?.getTracks().forEach((track) => track.stop())
		}
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
