'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'
import { images } from '@/components/contact/images'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { comments } from '@/components/contact/comments'

const ContactPage = () => {
	const renderStars = (rating: number) => {
		const stars = []
		for (let i = 1; i <= 5; i++) {
			if (rating >= i) {
				stars.push(<FaStar key={i} className='text-yellow-400' />)
			} else if (rating >= i - 0.5) {
				stars.push(<FaStarHalfAlt key={i} className='text-yellow-400' />)
			} else {
				stars.push(<FaRegStar key={i} className='text-yellow-400' />)
			}
		}
		return stars
	}

	return (
		<div className='max-w-6xl mx-auto p-12   mt-16 mb-24'>
			<h1 className='text-5xl font-extrabold text-blue-700 mb-16 tracking-tight drop-shadow-md text-center'>
				Kontakt - Sprzęt Budowlany
			</h1>

			<section className='mb-20  mx-auto text-center'>
				<div className='bg-blue-50 border mx-auto border-blue-200 rounded-3xl p-8 shadow-inner space-y-5'>
					<p className='text-gray-900 text-lg leading-relaxed'>
						<span className='font-semibold text-blue-700'>Firma:</span> Budownictwo Sp. z o.o.
					</p>
					<p className='text-gray-900 text-lg leading-relaxed'>
						<span className='font-semibold text-blue-700'>Adres:</span> ul. Przykładowa 15, 00-123 Warszawa
					</p>
					<p className='text-gray-900 text-lg leading-relaxed'>
						<span className='font-semibold text-blue-700'>Telefon:</span>{' '}
						<a
							href='tel:+48123456789'
							className='underline text-blue-600 hover:text-blue-800 transition-colors duration-300'
							title='Zadzwoń'>
							+48 123 456 789
						</a>
					</p>
					<p className='text-gray-900 text-lg leading-relaxed'>
						<span className='font-semibold text-blue-700'>Email:</span>{' '}
						<a
							href='mailto:kontakt@budownictwo.pl'
							className='underline text-blue-600 hover:text-blue-800 transition-colors duration-300'
							title='Wyślij email'>
							kontakt@budownictwo.pl
						</a>
					</p>
					<p className='text-gray-900 text-lg leading-relaxed'>
						<span className='font-semibold text-blue-700'>Godziny pracy:</span> Pon-Pt 8:00 - 17:00, Sob 9:00 - 13:00
					</p>
				</div>
			</section>

			<section className='mb-24'>
				<h2 className='text-3xl font-semibold text-blue-600 mb-10 border-b border-blue-300 pb-4 tracking-wide text-center sm:text-left'>
					Galeria wypożyczalni
				</h2>
				<Swiper
					modules={[Navigation, Pagination, Autoplay]}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 4000, disableOnInteraction: false }}
					loop
					spaceBetween={30}
					slidesPerView={1}
					className='rounded-3xl shadow-lg overflow-hidden'
					onSwiper={swiper => {
						const pagEl = swiper.pagination.el
						if (pagEl) {
							pagEl.style.position = 'relative'
							pagEl.style.marginTop = '1.75rem'
							pagEl.style.textAlign = 'center'
						}
					}}>
					{images.map(({ src, alt }, index) => (
						<SwiperSlide key={index}>
							<div className='relative w-full h-96 rounded-3xl overflow-hidden flex justify-center items-center shadow-inner'>
								<Image src={src} alt={alt} style={{ objectFit: 'contain' }} priority={index === 0} fill />
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</section>

			<section className='max-w-4xl mx-auto'>
				<h2 className='text-3xl font-semibold text-blue-600 mb-12 border-b border-blue-300 pb-4 tracking-wide text-center'>
					Opinie o naszym sprzęcie
				</h2>
				<div className='space-y-12'>
					{comments.map(({ id, author, text, rating }) => (
						<div
							key={id}
							className='bg-blue-50 border border-blue-200 rounded-3xl p-10 shadow-inner transition-shadow hover:shadow-xl'>
							<div className='flex items-center justify-between mb-6'>
								<p className='font-semibold text-blue-900 text-xl tracking-wide'>{author}</p>
								<div className='flex space-x-1'>{renderStars(rating)}</div>
							</div>
							<p className='italic text-gray-800 text-lg leading-relaxed tracking-wide'>{text}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default ContactPage
