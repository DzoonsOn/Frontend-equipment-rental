'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type NavigationClientProps = {
	isLoggedIn: boolean
}

const NavigationClient: React.FC<NavigationClientProps> = ({ isLoggedIn }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()
	const router = useRouter()

	const links = [
		{ href: '/', label: 'Strona główna', exact: true },
		{ href: '/sprzet', label: 'Sprzęt' },
		...(isLoggedIn ? [{ href: '/wypozyczenia', label: 'Moje wypożyczenia' }] : []),
		{ href: '/konto', label: isLoggedIn ? 'Wyloguj' : 'Zaloguj' },
		{ href: '/kontakt', label: 'Kontakt' },
	]

	const isActiveLink = (href: string, exact = false) => {
		if (exact) return pathname === href
		return pathname.startsWith(href) && href !== '/'
	}

	// Funkcja wylogowania
	const handleLogout = async () => {
		try {
			await fetch('/api/logout', { method: 'POST' })
			setMenuOpen(false)
			router.push('/login') // przekierowanie po wylogowaniu
		} catch (error) {
			console.error('Błąd podczas wylogowania:', error)
		}
	}

	return (
		<nav className='bg-blue-600 text-white shadow-md'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16'>
				{/* Logo */}
				<div className='text-xl font-bold tracking-wide'>
					<Link href='/' onClick={() => setMenuOpen(false)} className='hover:underline'>
						Wypożyczalnia Budowlana
					</Link>
				</div>

				{/* Hamburger button - mobile */}
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

				{/* Menu */}
				<ul
					className={`md:flex md:space-x-8 md:items-center md:static absolute left-0 w-full md:w-auto bg-blue-600 transition-all duration-300 ease-in-out ${
						menuOpen ? 'top-16' : 'top-[-490px]'
					} md:top-0`}>
					{links.map(({ href, label, exact }) => {
						// Jeśli to "Wyloguj", renderujemy button zamiast linka
						if (label === 'Wyloguj') {
							return (
								<li key={href} className='border-b border-blue-700 md:border-none'>
									<button
										onClick={handleLogout}
										className='block w-full text-left px-4 py-3 md:p-0 hover:bg-blue-700 md:hover:bg-transparent font-semibold border-b-2 border-white md:border-b-0'>
										{label}
									</button>
								</li>
							)
						}

						return (
							<li key={href} className='border-b border-blue-700 md:border-none'>
								<Link
									href={href}
									onClick={() => setMenuOpen(false)}
									className={`block px-4 py-3 md:p-0 hover:bg-blue-700 md:hover:bg-transparent ${
										isActiveLink(href, exact) ? 'font-semibold border-b-2 border-white md:border-b-0' : ''
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
