'use client'

import React, { useState, useEffect } from 'react'

type Rental = {
	rentalId: number
	userId: number
	constructionEquipId: number
	dataStart: string
	dataEnd: string
	amount: number
	deposit: number
	extraCost: number | null
	notes: string | null
}

type RentalListProps = {
	access_token: string
}

const RentalList = ({ access_token }: RentalListProps) => {
	const [rentals, setRentals] = useState<Rental[]>([])
	const [status, setStatus] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [extraCost, setExtraCost] = useState<number | null>(null)
	const [notes, setNotes] = useState<string>('')

	const [expandedRental, setExpandedRental] = useState<number | null>(null)
	const [showEquipment, setShowEquipment] = useState<boolean>(false)

	// Fetch rentals from the API
	useEffect(() => {
		const fetchRentals = async () => {
			try {
				const res = await fetch('http://localhost:8080/api/public/rentals', {
					headers: {
						accept: '*/*',
						Authorization: `Bearer ${access_token}`,
					},
				})
				if (!res.ok) {
					const data = await res.json()
					setError(data.message || 'Błąd podczas pobierania wypożyczeń')
					return
				}
				const data = await res.json()
				setRentals(data)
			} catch (err) {
				setError(`Wystąpił błąd sieciowy: ${err}`)
			}
		}

		fetchRentals()
	}, [access_token])

	const handleDelete = async (rentalId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/v1/rentals/${rentalId}`, {
				method: 'DELETE',
				headers: {
					accept: '*/*',
					Authorization: `Bearer ${access_token}`,
				},
			})

			if (!res.ok) {
				const data = await res.json()
				console.error('Delete error:', data) // Log the error
				setError(data.message || 'Błąd podczas usuwania wypożyczenia')
				return
			}

			console.log('Deleted rental', rentalId) // Log success
			setStatus('Wypożyczenie zostało usunięte!')
			setRentals(prevRentals => prevRentals.filter(rental => rental.rentalId !== rentalId))
		} catch (err) {
			console.error('Network error:', err) // Log network errors
			setError(`Wystąpił błąd sieciowy: ${err}`)
		}
	}

	const handleUpdate = async (rentalId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/v1/rentals/${rentalId}/extras`, {
				method: 'PATCH',
				headers: {
					accept: '*/*',
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ extraCost, notes }),
			})

			if (!res.ok) {
				const data = await res.json()
				console.error('Update error:', data)
				setError(data.message || 'Błąd podczas aktualizacji wypożyczenia')
				return
			}

			console.log('Updated rental', rentalId)
			setStatus('Dane wypożyczenia zostały zaktualizowane!')
			setExtraCost(null)
			window.location.reload()
			setNotes('')
		} catch (err) {
			console.error('Network error:', err)
			setError(`Wystąpił błąd sieciowy: ${err}`)
		}
	}

	const toggleDetails = (rentalId: number) => {
		setExpandedRental(prev => (prev === rentalId ? null : rentalId))
	}

	const toggleShowRentals = () => {
		setShowEquipment(prev => !prev)
	}

	return (
		<div className='max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Lista wypożyczeń</h1>

			{/* Button to toggle visibility of rentals */}
			<button
				onClick={toggleShowRentals}
				className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition mb-6'>
				{showEquipment ? 'Ukryj wypożyczenia' : 'Pokaż wypożyczenia'}
			</button>

			{/* Conditionally render rental list */}
			{showEquipment && (
				<div className='space-y-6'>
					{rentals.map(rental => (
						<div key={rental.rentalId} className='p-4 border text-black rounded-lg shadow-md'>
							<h2 className='text-xl font-semibold text-gray-800'>
								Wypożyczenie ID: {rental.rentalId}
								<button
									onClick={() => toggleDetails(rental.rentalId)}
									className='ml-4 text-blue-600 hover:text-blue-800 transition'>
									{expandedRental === rental.rentalId ? <span>▼ Zwiń szczegóły</span> : <span>▶ Rozwiń szczegóły</span>}
								</button>
							</h2>

							{/* Conditionally render rental details */}
							{expandedRental === rental.rentalId && (
								<div className='mt-4'>
									<p>
										<strong>Data rozpoczęcia:</strong> {rental.dataStart}
									</p>
									<p>
										<strong>Data zakończenia:</strong> {rental.dataEnd}
									</p>
									<p>
										<strong>Kwota:</strong> {rental.amount} zł
									</p>
									<p>
										<strong>Wkład własny:</strong> {rental.deposit} zł
									</p>
									<p>
										<strong>Ekstra koszty:</strong> {rental.extraCost ? `${rental.extraCost} zł` : 'Brak'}
									</p>
									<p>
										<strong>Notatki:</strong> {rental.notes || 'Brak'}
									</p>

									{/* Update extra cost and notes */}
									<div className='mt-4'>
										<label className='block mb-2'>Ekstra koszty:</label>
										<input
											type='number'
											value={extraCost || ''}
											onChange={e => setExtraCost(Number(e.target.value))}
											className='w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
										/>
										<label className='block mb-2'>Notatki:</label>
										<textarea
											value={notes}
											onChange={e => setNotes(e.target.value)}
											rows={3}
											className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
										/>
										<button
											onClick={() => handleUpdate(rental.rentalId)}
											className='mt-4 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700'>
											Zaktualizuj
										</button>
									</div>

									<button
										onClick={() => handleDelete(rental.rentalId)}
										className='mt-4 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700'>
										Usuń wypożyczenie
									</button>
								</div>
							)}
						</div>
					))}
					{error && <p className='mt-4 text-red-600'>{error}</p>}
					{status && <p className='mt-4 text-green-600'>{status}</p>}
				</div>
			)}
		</div>
	)
}

export default RentalList
