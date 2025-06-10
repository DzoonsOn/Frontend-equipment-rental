'use client'

import React, { useState } from 'react'

type Category = {
	categoryId: number
	name: string
	description: string
}

type CategoryListProps = {
	access_token: string
}

const CategoryList = ({ access_token }: CategoryListProps) => {
	const [categories, setCategories] = useState<Category[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [showCategories, setShowCategories] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

	const fetchCategories = async () => {
		setLoading(true)
		try {
			const res = await fetch(`http://localhost:8080/api/public/category`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				const data = await res.json()
				setError(data.message || 'Błąd podczas pobierania kategorii')
				return
			}

			const data = await res.json()
			setCategories(data)
		} catch (err) {
			setError(`Wystąpił błąd sieciowy: ${err}`)
		} finally {
			setLoading(false)
		}
	}

	const toggleCategories = () => {
		setShowCategories(!showCategories)
		if (!showCategories) {
			fetchCategories()
		}
	}

	const handleDelete = async () => {
		if (selectedCategoryId === null) return

		try {
			const res = await fetch(`http://localhost:8080/api/v1/category/${selectedCategoryId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (res.ok) {
				setCategories(prev => prev.filter(item => item.categoryId !== selectedCategoryId))
				setShowModal(false) // Close the modal after deletion
			} else {
				const data = await res.json()
				setError(data.message || 'Błąd podczas usuwania kategorii')
			}
		} catch (err) {
			setError(`Wystąpił błąd sieciowy przy usuwaniu kategorii: ${err}`)
		}
	}

	const handleShowModal = (id: number) => {
		setSelectedCategoryId(id)
		setShowModal(true)
	}

	return (
		<div className='max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Lista kategorii</h1>

			<button
				onClick={toggleCategories}
				className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition mb-6'>
				{showCategories ? 'Ukryj kategorie' : 'Pokaż kategorie'}
			</button>

			{loading && <p className='text-black'>Ładowanie...</p>}
			{error && <p className='text-red-600'>{error}</p>}

			{showCategories && !loading && !error && categories.length > 0 && (
				<table className='min-w-full table-auto'>
					<thead>
						<tr className='bg-blue-100'>
							<th className='px-4 py-2 border-b text-left text-black'>ID</th>
							<th className='px-4 py-2 border-b text-left text-black'>Nazwa</th>
							<th className='px-4 py-2 border-b text-left text-black'>Opis</th>
							<th className='px-4 py-2 border-b text-left text-black'>Akcja</th>
						</tr>
					</thead>
					<tbody>
						{categories.map(category => (
							<tr key={category.categoryId} className='hover:bg-gray-100'>
								<td className='px-4 py-2 border-b text-black'>{category.categoryId}</td>
								<td className='px-4 py-2 border-b text-black'>{category.name}</td>
								<td className='px-4 py-2 border-b text-black'>{category.description}</td>
								<td className='px-4 py-2 border-b text-black'>
									<button
										onClick={() => handleShowModal(category.categoryId)}
										className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md'>
										Usuń
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{showCategories && categories.length === 0 && <p className='text-black'>Brak kategorii do wyświetlenia.</p>}

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-lg'>
					<div className='bg-gray-800 text-white p-6 rounded-md'>
						<h2 className='text-xl mb-4'>Potwierdź usunięcie</h2>
						<p>Czy na pewno chcesz usunąć tę kategorię?</p>
						<div className='mt-4 flex justify-end'>
							<button onClick={() => setShowModal(false)} className='bg-gray-400 text-white py-2 px-4 rounded-md mr-2'>
								Anuluj
							</button>
							<button onClick={handleDelete} className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md'>
								Usuń
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default CategoryList
