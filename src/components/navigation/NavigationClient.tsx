'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type NavigationClientProps = {
	isLoggedIn: boolean
	isAdmin: boolean
	onLogout?: () => void
}

const NavigationClient: React.FC<NavigationClientProps> = ({
	isLoggedIn: initialIsLoggedIn,
	isAdmin: initialIsAdmin,
	onLogout,
}) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn)
	const [isAdmin, setIsAdmin] = useState(initialIsAdmin)

	const pathname = usePathname()
	const router = useRouter()

	const links = [
		{ href: '/', label: 'Strona główna', exact: true },
		{ href: '/rentPage', label: 'Sprzęt' },
		...(isLoggedIn ? [{ href: '/rentsAll', label: 'Moje wypożyczenia' }] : []),
		{ href: '/contact', label: 'Kontakt' },
		...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
		...(isLoggedIn ? [{ href: '/mydata', label: 'Profil' }] : []),
		{ href: isLoggedIn ? '/logout' : '/login', label: isLoggedIn ? 'Wyloguj' : 'Zaloguj' },
	]

	const isActiveLink = (href: string, exact = false) => {
		if (exact) return pathname === href
		return pathname.startsWith(href) && href !== '/'
	}

	const handleLogout = async () => {
		try {
			await fetch('/api/logout', { method: 'POST' })
			setIsLoggedIn(false)
			setIsAdmin(false)
			if (onLogout) {
				onLogout()
			}
			router.push('/login')
		} catch (error) {
			console.error('Błąd podczas wylogowania:', error)
		}
	}

	useEffect(() => {
		setIsLoggedIn(initialIsLoggedIn)
		setIsAdmin(initialIsAdmin)
	}, [initialIsLoggedIn, initialIsAdmin])

	return (
		<nav className='bg-blue-600 text-white shadow-md'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16'>
				<div className='text-xl font-bold tracking-wide'>
					<Link href='/' onClick={() => setMenuOpen(false)} className='hover:underline'>
						MaxBUD
					</Link>
				</div>

				<div className='md:hidden'>
					<button onClick={() => setMenuOpen(!menuOpen)} className='focus:outline-none' aria-label='Toggle menu'>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							{menuOpen ? (
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							) : (
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
							)}
						</svg>
					</button>
				</div>

				<ul
					className={`md:flex md:space-x-8 md:items-center md:static absolute left-0 w-full md:w-auto bg-blue-600 transition-all duration-300 ease-in-out ${
						menuOpen ? 'top-16' : 'top-[-490px]'
					} md:top-0`}>
					{links.map(({ href, label, exact }) => {
						if (label === 'Wyloguj') {
							return (
								<li key={href} className='md:border-none flex justify-center md:justify-start'>
									<button
										onClick={label === 'Wyloguj' ? handleLogout : undefined}
										className='block px-5 py-2 md:px-4 md:py-2 bg-blue-800  font-semibold rounded-full hover:bg-blue-900 transition-colors border-2 cursor-pointer shadow-md md:border-none md:shadow-none'>
										{label}
									</button>
								</li>
							)
						}
						if (label === 'Zaloguj') {
							return (
								<li key={href} className='md:border-none flex justify-center md:justify-start'>
									<Link href={href}>
										<button className='block px-5 py-2 md:px-4 md:py-2 bg-blue-800  font-semibold rounded-full hover:bg-blue-900 transition-colors border-2 cursor-pointer shadow-md md:border-none md:shadow-none'>
											{label}
										</button>
									</Link>
								</li>
							)
						}

						return (
							<li key={href} className='border-b  md:border-none'>
								<Link
									href={href}
									onClick={() => setMenuOpen(false)}
									className={`block px-5 py-2 md:px-3 md:py-2 font-semibold rounded-full hover:bg-blue-700 ${
										isActiveLink(href, exact)
											? 'block px-5 py-2 md:px-3 md:py-2 bg-blue-700  font-semibold rounded-full transition-colors border-2 cursor-pointer shadow-md md:border-none md:shadow-none'
											: ''
									}`}>
									{label}
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
		</nav>
	)
}

export default NavigationClient
