import React from 'react'
import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const Footer = () => {
	return (
		<footer className='bg-blue-900 text-white py-12'>
			<div className='max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between space-y-8 md:space-y-0'>
				<div className='md:w-1/3'>
					<h3 className='text-xl font-semibold mb-4'>Kontakt</h3>
					<p>Budownictwo Sp. z o.o.</p>
					<p>ul. Przykładowa 15</p>
					<p>00-123 Warszawa</p>
					<p>Telefon: +48 123 456 789</p>
					<p>
						Email:{' '}
						<a href='mailto:kontakt@budownictwo.pl' className='underline hover:text-gray-300'>
							kontakt@budownictwo.pl
						</a>
					</p>
				</div>

				<div className='md:w-1/3'>
					<h3 className='text-xl font-semibold mb-4'>Szybkie linki</h3>
					<ul className='space-y-2'>
						<li>
							<Link href='/' className='hover:underline hover:text-gray-300'>
								Strona główna
							</Link>
						</li>
						<li>
							<Link href='/rentPage' className='hover:underline hover:text-gray-300'>
								Sprzęt
							</Link>
						</li>
						<li>
							<Link href='/wypozyczenia' className='hover:underline hover:text-gray-300'>
								Moje wypożyczenia
							</Link>
						</li>
						<li>
							<Link href='/contact' className='hover:underline hover:text-gray-300'>
								Kontakt
							</Link>
						</li>
						<li>
							<Link href='/admin' className='hover:underline hover:text-gray-300'>
								Panel admina
							</Link>
						</li>
					</ul>
				</div>

				<div className='md:w-1/3'>
					<h3 className='text-xl font-semibold mb-4'>Znajdź nas w sieci</h3>
					<div className='flex space-x-6 text-white text-2xl'>
						<a
							href='https://facebook.com'
							aria-label='Facebook'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-gray-300'>
							<FaFacebookF />
						</a>
						<a
							href='https://twitter.com'
							aria-label='Twitter'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-gray-300'>
							<FaTwitter />
						</a>
						<a
							href='https://instagram.com'
							aria-label='Instagram'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-gray-300'>
							<FaInstagram />
						</a>
						<a
							href='https://linkedin.com'
							aria-label='LinkedIn'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-gray-300'>
							<FaLinkedinIn />
						</a>
					</div>
				</div>
			</div>

			<div className='border-t border-blue-700 mt-12 pt-6 text-center text-gray-400 text-sm select-none'>
				&copy; {new Date().getFullYear()} Budownictwo Sp. z o.o. Wszelkie prawa zastrzeżone.
			</div>
		</footer>
	)
}

export default Footer
