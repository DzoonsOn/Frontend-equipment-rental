'use client'
import React, { useEffect, useState } from 'react'

type Rental = {
	rentalId: number
	userId: number
	constructionEquipId: number
	dataStart: string
	dataEnd: string
	amount: number
	deposit: number
	extraCost: number
	notes: string
}

type RentalComponentProps = {
	userId: number
}

const RentalComponent: React.FC<RentalComponentProps> = ({ userId }) => {
	const [activeRentals, setActiveRentals] = useState<Rental[]>([])
	const [completedRentals, setCompletedRentals] = useState<Rental[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({})

	useEffect(() => {
		const fetchRentals = async () => {
			try {
				const activeResponse = await fetch(`http://localhost:8080/api/public/rentals/active/${userId}`)
				const completedResponse = await fetch(`http://localhost:8080/api/public/rentals/ended/${userId}`)

				if (!activeResponse.ok) {
					throw new Error('Failed to fetch active rentals')
				}
				if (!completedResponse.ok) {
					throw new Error('Failed to fetch completed rentals')
				}

				const activeData = await activeResponse.json()
				const completedData = await completedResponse.json()

				setActiveRentals(activeData)
				setCompletedRentals(completedData)
			} catch (err: any) {
				console.error('Error fetching rentals:', err)
				setError('An error occurred while fetching rental data.')
			} finally {
				setLoading(false)
			}
		}

		fetchRentals()
	}, [userId])

	const toggleExpand = (rentalId: number) => {
		setExpanded(prevState => ({
			...prevState,
			[rentalId]: !prevState[rentalId],
		}))
	}

	if (loading) {
		return <div className='text-center text-blue-500'>Loading...</div>
	}

	if (error) {
		return <div className='text-center text-red-500'>{error}</div>
	}

	return (
		<div className='max-w-4xl mx-auto p-4'>
			{/* Active Rentals */}
			<h2 className='text-xl font-semibold mb-4 text-blue-600'>Active Rentals</h2>
			<div className='space-y-4'>
				{activeRentals.length === 0 ? (
					<p className='text-gray-500'>No active rentals.</p>
				) : (
					activeRentals.map(rental => (
						<div key={rental.rentalId} className='border-b border-blue-300 pb-4'>
							<button
								onClick={() => toggleExpand(rental.rentalId)}
								className='w-full text-left text-blue-700 font-semibold bg-blue-100 p-2 rounded-lg transition-all hover:bg-blue-200'>
								Rental ID: {rental.rentalId} (Click to {expanded[rental.rentalId] ? 'Collapse' : 'Expand'})
							</button>
							{expanded[rental.rentalId] && (
								<div className='mt-2 space-y-2 text-blue-800'>
									<p>
										<strong>Start Date:</strong> {rental.dataStart}
									</p>
									<p>
										<strong>End Date:</strong> {rental.dataEnd}
									</p>
									<p>
										<strong>Amount:</strong> {rental.amount}
									</p>
									<p>
										<strong>Deposit:</strong> {rental.deposit}
									</p>
									<p>
										<strong>Extra Costs:</strong> {rental.extraCost}
									</p>
									<p>
										<strong>Notes:</strong> {rental.notes}
									</p>
								</div>
							)}
						</div>
					))
				)}
			</div>

			{/* Completed Rentals */}
			<h2 className='text-xl font-semibold mt-8 mb-4 text-blue-600'>Completed Rentals</h2>
			<div className='space-y-4'>
				{completedRentals.length === 0 ? (
					<p className='text-gray-500'>No completed rentals.</p>
				) : (
					completedRentals.map(rental => (
						<div key={rental.rentalId} className='border-b border-blue-300 pb-4'>
							<button
								onClick={() => toggleExpand(rental.rentalId)}
								className='w-full text-left text-blue-700 font-semibold bg-blue-100 p-2 rounded-lg transition-all hover:bg-blue-200'>
								Rental ID: {rental.rentalId} (Click to {expanded[rental.rentalId] ? 'Collapse' : 'Expand'})
							</button>
							{expanded[rental.rentalId] && (
								<div className='mt-2 space-y-2 text-blue-800'>
									<p>
										<strong>Start Date:</strong> {rental.dataStart}
									</p>
									<p>
										<strong>End Date:</strong> {rental.dataEnd}
									</p>
									<p>
										<strong>Amount:</strong> {rental.amount}
									</p>
									<p>
										<strong>Deposit:</strong> {rental.deposit}
									</p>
									<p>
										<strong>Extra Costs:</strong> {rental.extraCost}
									</p>
									<p>
										<strong>Notes:</strong> {rental.notes}
									</p>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default RentalComponent
