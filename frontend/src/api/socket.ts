import { io } from 'socket.io-client'

const WS_URL =
	import.meta.env.VITE_WS_URL ??
	`${window.location.protocol}//${window.location.hostname}:3000`

export const ICE_SERVERS: RTCConfiguration = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

export const socket = io(WS_URL, { autoConnect: false })
