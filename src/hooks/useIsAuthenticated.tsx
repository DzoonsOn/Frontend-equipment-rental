'use client'

import { useEffect, useState } from 'react'

export const useIsAuthenticated = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch('/api/me', { credentials: 'include' })
				setIsAuthenticated(res.ok)
			} catch (err) {
				console.error('Błąd podczas fetch:', err)
				setIsAuthenticated(false)
			}
		}
		checkAuth()
	}, [])

	return isAuthenticated
}
