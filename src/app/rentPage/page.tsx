'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PageData, ConstructionResponse } from '@/components/rent/config'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'

const RentPage = () => {
	const [equipment, setEquipment] = useState<ConstructionResponse[]>([])
	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState(0)
	const [sortBy, setSortBy] = useState('')
	const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
	const [search, setSearch] = useState('')
	const [totalPages, setTotalPages] = useState(1)

	const isAuthenticate = useIsAuthenticated()

	const router = useRouter()

	const fetchData = async () => {
		setLoading(true)

		let url = `http://localhost:8080/api/public/filtered?page=${page}&size=9`

		if (sortBy.trim() !== '') {
			url += `&sortBy=${sortBy}&direction=${direction}`
		}

		if (search.trim() !== '') {
			url += `&search=${encodeURIComponent(search)}`
		}

		try {
			const response = await fetch(url)
			const data: PageData = await response.json()
			setEquipment(data.content || [])
			setTotalPages(data.totalPages || 1)
		} catch (error) {
			setEquipment([])
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [page, sortBy, direction, search])

	const handleSortByChange = (value: string) => {
		if (sortBy === value) {
			setSortBy('')
			setPage(0)
		} else {
			setSortBy(value)
			setDirection('asc')
			setPage(0)
		}
	}

	const handleSearchChange = (value: string) => {
		setSearch(value)
		setPage(0)
	}

	return (
		<div className='p-6 min-h-screen max-w-[1280px] mx-auto'>
			<h1 className='text-4xl font-bold mb-4 text-gray-900'>Strona Wypożycz</h1>
			<p className='mb-8 text-lg text-gray-800'>Tutaj możesz wypożyczyć sprzęt budowlany.</p>

			<div className='mb-6 flex flex-wrap items-center gap-4'>
				<input
					type='text'
					placeholder='Szukaj sprzętu...'
					value={search}
					onChange={e => handleSearchChange(e.target.value)}
					className='
            border border-gray-300 bg-white text-black rounded px-3 py-2 flex-grow max-w-xs
            focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-transparent
            placeholder:text-gray-400 placeholder:opacity-80
            transition
          '
				/>

				<button
					onClick={() => handleSortByChange('name')}
					className={`px-4 py-2 rounded lowercase font-semibold tracking-wide transition
            ${sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-900'}
            hover:bg-blue-700 hover:text-white`}>
					sortuj po nazwie
				</button>

				<button
					onClick={() => handleSortByChange('category.name')}
					className={`px-4 py-2 rounded lowercase font-semibold tracking-wide transition
            ${sortBy === 'category.name' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-900'}
            hover:bg-blue-700 hover:text-white`}>
					sortuj po kategorii
				</button>

				<button
					onClick={() => setDirection('asc')}
					className={`px-3 py-2 rounded font-semibold tracking-wide transition
            ${direction === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
            hover:bg-blue-700 hover:text-white`}>
					rosnąco ↑
				</button>
				<button
					onClick={() => setDirection('desc')}
					className={`px-3 py-2 rounded font-semibold tracking-wide transition
            ${direction === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}
            hover:bg-blue-700 hover:text-white`}>
					malejąco ↓
				</button>
			</div>

			{loading ? (
				<p className='text-gray-700 text-lg'>Ładowanie danych...</p>
			) : equipment.length === 0 ? (
				<p className='text-gray-700 text-lg'>Brak wyników</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4'>
					{equipment.map(item => (
						<Link
							key={item.constructionEquipId}
							href={`/rentPage/${item.constructionEquipId}`}
							className='bg-white shadow-md rounded-xl overflow-hidden border border-gray-300 transition hover:shadow-xl min-h-[450px] flex flex-col'>
							<div className='relative w-full h-64 border-b border-gray-200 mb-6 rounded-t-xl overflow-hidden'>
								<Image
									src={item.zdjecieLink}
									alt={item.zdjecieLink}
									fill
									className='object-cover'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									priority={false}
								/>
							</div>

							<div className='flex flex-col gap-3 px-8 pr-3 flex-grow'>
								<h2 className='text-2xl font-semibold text-gray-900'>{item.name}</h2>

								<div className='flex items-center'>
									<span className='font-semibold text-gray-700 w-32'>Kategoria:</span>
									<span className='text-gray-900'>{item.category.name}</span>
								</div>

								<div className='flex items-center'>
									<span className='font-semibold text-gray-700 w-32'>Uprawnienia:</span>
									<span className='text-gray-900'>{item.permission ? 'Tak' : 'Brak'}</span>
								</div>

								<div className='flex items-center justify-between'>
									<p className='text-blue-700 text-xl font-semibold'>
										Cena za dzień: <span className='font-bold'>{item.pricePerDay} zł</span>
									</p>
									{isAuthenticate && (
										<button
											type='button'
											className='
                      bg-blue-600
                      cursor-pointer
                      text-white
                      font-semibold
                      px-3
                      py-1.5
                      rounded-xl
                      transition
                      duration-300
                      ease-in-out
                      hover:bg-blue-800
                      hover:scale-105
                      focus:outline-none
                      focus:ring-4
                      focus:ring-blue-300
                    '
											onClick={e => {
												e.preventDefault()

												router.push(`/rents?itemId=${item.constructionEquipId}`)
											}}>
											Wypożycz
										</button>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			<div className='mt-8 flex justify-center gap-4'>
				<button
					disabled={page === 0}
					onClick={() => setPage(prev => Math.max(prev - 1, 0))}
					className={` 
            px-4 py-2 rounded border border-blue-700
            bg-blue-600 text-white
            disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-300
            hover:bg-blue-700 disabled:hover:bg-gray-300
            transition
            ${page !== 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
					Poprzednia
				</button>
				<button
					disabled={page + 1 >= totalPages}
					onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
					className={` 
            px-4 py-2 rounded border border-blue-700
            bg-blue-600 text-white
            disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-300
            hover:bg-blue-700 disabled:hover:bg-gray-300
            transition
            ${page + 1 < totalPages ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
					Następna
				</button>
			</div>
		</div>
	)
}

export default RentPage
