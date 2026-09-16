import { io } from 'socket.io-client'

const WS_URL =
	import.meta.env.VITE_WS_URL ??
	`${window.location.protocol}//${window.location.hostname}:3000`

const TURN_URL = import.meta.env.VITE_TURN_URL
const TURN_USERNAME = import.meta.env.VITE_TURN_USERNAME
const TURN_CREDENTIAL = import.meta.env.VITE_TURN_CREDENTIAL

export const ICE_SERVERS: RTCConfiguration = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		// свой TURN-релей (coturn), нужен когда STUN не пробивает NAT между
		// двумя реальными сетями и прямое p2p-соединение не находится
		...(TURN_URL && TURN_USERNAME && TURN_CREDENTIAL
			? [
					{
						urls: [`turn:${TURN_URL}`, `turn:${TURN_URL}?transport=tcp`],
						username: TURN_USERNAME,
						credential: TURN_CREDENTIAL,
					},
				]
			: []),
	],
}

export const socket = io(WS_URL, { autoConnect: false })
