export function playSound(sound: HTMLAudioElement) {
	sound.currentTime = 0
	void sound.play().catch(() => {})
}
