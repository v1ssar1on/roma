import { useState } from 'react'

export const useDisclosure = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	function onClose() {
		setIsOpen((prev) => !prev)
	}

	return { isOpen, onClose }
}
