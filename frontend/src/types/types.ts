export type RoomId = string

export interface RoomJoinedPayload {
	peerId: string
	peers: string[]
}

export interface PeerLeftPayload {
	peerId: string
}

export interface SignalPayload {
	from: string
	data: RTCSessionDescriptionInit | RTCIceCandidateInit
}

export interface MessagePayload {
	id: string
	text: string
	authorName: string
	createdAt: string
}
