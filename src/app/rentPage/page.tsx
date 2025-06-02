'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Category {
	categoryId: number
	name: string
	description: string
}

interface ConstructionEquip {
	constructionEquipId: number
	category: Category
	name: string
	permission: boolean
	pricePerDay: number
	zdjecieLink: string
}

const RentPage = () => {
	const [equipment, setEquipment] = useState<ConstructionEquip[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('http://localhost:8080/api/public/equipment')
			.then(res => res.json())
			.then((data: ConstructionEquip[]) => {
				setEquipment(data)
				setLoading(false)
			})
			.catch(err => {
				console.error('Błąd podczas pobierania danych:', err)
				setLoading(false)
			})
	}, [])

	return (
		<div className='p-6 bg-[#f8f9fa] min-h-screen'>
			<h1 className='text-4xl font-bold mb-4 text-gray-900'>Strona Wypożycz</h1>
			<p className='mb-8 text-lg text-gray-800'>Tutaj możesz wypożyczyć sprzęt budowlany.</p>

			{loading ? (
				<p className='text-gray-700 text-lg'>Ładowanie danych...</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{equipment.map(item => (
						<div
							key={item.constructionEquipId}
							className='bg-white shadow-md rounded-2xl overflow-hidden border border-gray-300 transition hover:shadow-xl'>
							<div className='relative w-full h-56 border-b border-gray-200'>
								<Image
									src={item.zdjecieLink}
									alt={item.name}
									fill
									className='object-cover'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									priority={false}
								/>
							</div>
							<div className='p-5'>
								<h2 className='text-2xl font-semibold text-gray-900 mb-1'>{item.name}</h2>
								<p className='text-base text-gray-800'>
									<b>Kategoria:</b> {item.category.name}
								</p>
								<p className='text-base text-gray-800'>
									<b>Uprawnienia:</b> {item.permission || 'Brak'}
								</p>
								{/* <p className='text-base text-gray-900 mt-1 flex items-center gap-2'>
									<b>Status:</b>
									<span
										className={`px-2 py-0.5 text-sm rounded border ${
											item.status === 'Dostępny' ? 'border-green-600' : 'border-red-600'
										}`}>
										{item.status}
									</span>
								</p> */}
								<p className='text-lg text-gray-900 mt-3 font-medium'>
									Cena za dzień: <span className='text-blue-600 font-bold'>{item.pricePerDay} zł</span>
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default RentPage
