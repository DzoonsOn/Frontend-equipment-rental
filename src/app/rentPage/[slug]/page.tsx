'use client'

import React, { use, useEffect, useState } from 'react'
import { ConstructionResponse } from '@/components/rent/config'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'

interface Props {
	params: Promise<{
		slug: string
	}>
}

const RentDetailPage = ({ params }: Props) => {
	const { slug } = use(params)
	const router = useRouter()

	const [equipment, setEquipment] = useState<ConstructionResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const isAuthenticate = useIsAuthenticated()

	useEffect(() => {
		if (!slug) return

		setLoading(true)
		setError(null)

		fetch(`http://localhost:8080/api/public/equipment/ById/${slug}`)
			.then(res => {
				if (!res.ok) throw new Error('Nie znaleziono sprzętu')
				return res.json()
			})
			.then((data: ConstructionResponse) => {
				setEquipment(data)
				setLoading(false)
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
		</div>
	)
}

export default RentDetailPage
