import React, { useEffect, useState, useRef } from 'react'
import styles from './succesModal.module.css'

type SuccessModalProps = {
	message: string
	duration?: number
	onClose: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, duration = 1000, onClose }) => {
	const [progress, setProgress] = useState(0)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const interval = 50
		const increment = 100 / (duration / interval)

		timerRef.current = setInterval(() => {
			setProgress(oldProgress => {
				const newProgress = oldProgress + increment
				if (newProgress >= 100) {
					if (timerRef.current) clearInterval(timerRef.current)
					return 100
				}
				return newProgress
			})
		}, interval)

		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [duration])

	useEffect(() => {
		if (progress >= 100) {
			onClose()
		}
	}, [progress, onClose])

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<p>{message}</p>
				<div className={styles.progressBarContainer}>
					<div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
				</div>
			</div>
		</div>
	)
}

export default SuccessModal
