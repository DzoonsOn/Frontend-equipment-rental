'use client'

import React, { use, useEffect, useState } from 'react'
import { ConstructionResponse } from '@/components/rent/config'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/pagination'

interface Props {
	params: Promise<{
		slug: string
	}>
}

const RentDetailPage = ({ params }: Props) => {
	const { slug } = use(params)
	const router = useRouter()

	const [equipment, setEquipment] = useState<ConstructionResponse | null>(null)
	const [categoryEquipments, setCategoryEquipments] = useState<ConstructionResponse[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const isAuthenticate = useIsAuthenticated()

	useEffect(() => {
		if (!slug) return

		setLoading(true)
		setError(null)

		// Fetch the main equipment details
		fetch(`http://localhost:8080/api/public/equipment/ById/${slug}`)
			.then(res => {
				if (!res.ok) throw new Error('Nie znaleziono sprzętu')
				return res.json()
			})
			.then((data: ConstructionResponse) => {
				setEquipment(data)
				setLoading(false)

				// Fetch all equipment from the same category
				if (data.categoryDto) {
					fetch(`http://localhost:8080/api/public/equipment/category/${data.categoryDto.categoryId}`)
						.then(res => res.json())
						.then((categoryData: ConstructionResponse[]) => {
							setCategoryEquipments(categoryData)
						})
				}
			})
			.catch(err => {
				setError(err.message)
				setLoading(false)
			})
	}, [slug])

	if (loading) return <p className='text-center mt-20 text-lg text-blue-600 font-semibold'>Ładowanie danych...</p>
	if (error) return <p className='text-center mt-20 text-lg text-red-600 font-semibold'>Błąd: {error}</p>
	if (!equipment) return <p className='text-center mt-20 text-lg italic text-gray-600'>Brak danych o sprzęcie</p>

	return (
		<div className='max-w-4xl mx-auto p-8 bg-white space-y-12'>
			<div className='bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200'>
				<h2 className='text-xl font-semibold text-black tracking-wide'>Kategoria</h2>
				<p className='text-black mt-1'>{equipment.categoryDto.name}</p>
			</div>

			<h1 className='text-4xl font-extrabold text-black tracking-tight text-center'>
				{equipment.constructionDto.name}
			</h1>

			<div
				className='relative rounded-2xl overflow-hidden shadow-lg border border-gray-300'
				style={{ aspectRatio: '16 / 9' }}>
				<Image
					src={equipment.constructionDto.zdjecieLink}
					alt={equipment.constructionDto.name}
					className='w-full h-full object-cover'
					loading='lazy'
					layout='fill'
				/>
			</div>

			<div className='bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 space-y-4'>
				<div>
					<h3 className='text-lg font-semibold text-black'>Opis kategorii</h3>
					<p className='text-black mt-1 leading-relaxed'>{equipment.categoryDto.description}</p>
				</div>
				<div>
					<h3 className='text-lg font-semibold text-black'>Uprawnienia</h3>
					<p className='text-black mt-1'>{equipment.constructionDto.permission ? 'Wymagane' : 'Nie wymagane'}</p>
				</div>
			</div>

			<div className='flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-md border border-gray-300 p-6 gap-6'>
				<p className='text-black text-3xl font-extrabold'>
					Cena za dzień: <span className='font-black'>{equipment.constructionDto.pricePerDay} zł</span>
				</p>
				{isAuthenticate && (
					<button
						type='button'
						className='bg-blue-600 cursor-pointer text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-md'
						onClick={() => router.push(`/rents?itemId=${slug}`)}>
						Wypożycz
					</button>
				)}
			</div>

			{categoryEquipments.length > 0 && (
				<div className='mt-12'>
					<h2 className='text-2xl font-semibold text-black'>Produkty z tej samej kategorii</h2>
					<Swiper
						modules={[Pagination]}
						spaceBetween={20}
						slidesPerView={3}
						loop={true}
						pagination={{
							clickable: true,
							el: '.swiper-pagination',
							type: 'bullets',
						}}
						breakpoints={{
							320: {
								slidesPerView: 1,
							},
							768: {
								slidesPerView: 2,
							},
						}}>
						{categoryEquipments.map(item => (
							<SwiperSlide key={item.constructionDto.constructionEquipId}>
								<div className='p-4'>
									<Link
										href={`/rentPage/${item.constructionDto.constructionEquipId}`}
										className='bg-white shadow-md rounded-xl overflow-hidden border border-gray-300 transition hover:shadow-xl min-h-[450px] flex flex-col'>
										<div className='relative w-full h-64 border-b border-gray-200 mb-6 rounded-t-xl overflow-hidden'>
											<Image
												src={item.constructionDto.zdjecieLink}
												alt={item.constructionDto.zdjecieLink}
												fill
												className='object-cover'
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												priority={false}
											/>
										</div>

										<div className='flex flex-col gap-3 px-8 pr-3 flex-grow'>
											<h2 className='text-2xl font-semibold text-gray-900'>{item.constructionDto.name}</h2>

											<div className='flex items-center'>
												<span className='font-semibold text-gray-700 w-32'>Kategoria:</span>
												<span className='text-gray-900 truncate max-w-xs'>{item.categoryDto.name}</span>
											</div>

											<div className='flex items-center'>
												<span className='font-semibold text-gray-700 w-32'>Uprawnienia:</span>
												<span className='text-gray-900'>{item.constructionDto.permission ? 'Tak' : 'Brak'}</span>
											</div>

											<div className='flex items-center justify-between'>
												<p className='text-blue-700 text-xl font-semibold'>
													Cena za dzień: <span className='font-bold'>{item.constructionDto.pricePerDay} zł</span>
												</p>
												{isAuthenticate && (
													<button
														type='button'
														className='bg-blue-600 cursor-pointer text-white font-semibold px-3 py-1.5 rounded-xl transition duration-300 ease-in-out hover:bg-blue-800 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300'
														onClick={e => {
															e.preventDefault()
															router.push(`/rents?itemId=${item.constructionDto.constructionEquipId}`)
														}}>
														Wypożycz
													</button>
												)}
											</div>
										</div>
									</Link>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}
		</div>
	)
}

export default RentDetailPage
