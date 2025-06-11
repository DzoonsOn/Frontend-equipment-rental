'use client'

import { useState } from 'react'
import Link from 'next/link'

type ConstructionDto = {
	constructionEquipId: number
	name: string
	categoryId: number
	pricePerDay: number
	zdjecieLink: string
	description: string
}

type EquipmentListProps = {
	access_token: string
}

const EquipmentList = ({ access_token }: EquipmentListProps) => {
	const [equipmentList, setEquipmentList] = useState<ConstructionDto[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [showEquipment, setShowEquipment] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null)

	const fetchEquipment = async () => {
		setLoading(true)
		try {
			const res = await fetch(`http://localhost:8080/api/public/equipment`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				const data = await res.json()
				setError(data.message || 'Błąd podczas pobierania sprzętu')
				return
			}

			const data = await res.json()

			const equipment = data.map((item: { constructionDto: ConstructionDto }) => item.constructionDto)

			setEquipmentList(equipment)
		} catch (err) {
			setError(`Wystąpił błąd sieciowy: ${err}`)
		} finally {
			setLoading(false)
		}
	}

	const toggleEquipment = () => {
		setShowEquipment(!showEquipment)
		if (!showEquipment) {
			fetchEquipment()
		}
	}

	const handleDelete = async () => {
		if (selectedEquipmentId === null) return

		try {
			const res = await fetch(`http://localhost:8080/api/v1/equipment/${selectedEquipmentId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (res.ok) {
				setEquipmentList(prev => prev.filter(item => item.constructionEquipId !== selectedEquipmentId))
				setShowModal(false)
			} else {
				setError('Błąd podczas usuwania sprzętu, sprzęt jest gdzieś aktualnie przez kogoś wynajęty')
				window.location.reload()
			}
		} catch (err) {
			setError(`Wystąpił błąd sieciowy przy usuwaniu sprzętu: ${err}`)
		}
	}

	const handleShowModal = (id: number) => {
		setSelectedEquipmentId(id)
		setShowModal(true)
	}

	return (
		<div className='max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Lista sprzętu</h1>

			<button
				onClick={toggleEquipment}
				className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition mb-6'>
				{showEquipment ? 'Ukryj sprzęt' : 'Pokaż sprzęt'}
			</button>

			{loading && <p className='text-black'>Ładowanie...</p>}
			{error && <p className='text-red-600'>{error}</p>}

			{showEquipment && !loading && !error && equipmentList.length > 0 && (
				<table className='min-w-full table-auto'>
					<thead>
						<tr className='bg-blue-100'>
							<th className='px-4 py-2 border-b text-left text-black'>ID</th>
							<th className='px-4 py-2 border-b text-left text-black'>Nazwa</th>
							<th className='px-4 py-2 border-b text-left text-black'>Cena za dzień</th>
							<th className='px-4 py-2 border-b text-left text-black'>Opis</th>
							<th className='px-4 py-2 border-b text-left text-black'>Obrazek</th>
							<th className='px-4 py-2 border-b text-left text-black'>Akcja</th>
						</tr>
					</thead>
					<tbody>
						{equipmentList.map(equipment => (
							<tr key={equipment.constructionEquipId} className='hover:bg-gray-100'>
								<td className='px-4 py-2 border-b text-black'>
									<Link href={`/rentPage/${equipment.constructionEquipId}`} passHref>
										{equipment.constructionEquipId}
									</Link>
								</td>
								<td className='px-4 py-2 border-b text-black'>
									<Link href={`/rentPage/${equipment.constructionEquipId}`} passHref>
										{equipment.name}
									</Link>
								</td>
								<td className='px-4 py-2 border-b text-black'>
									<Link href={`/rentPage/${equipment.constructionEquipId}`} passHref>
										{equipment.pricePerDay} PLN
									</Link>
								</td>
								<td className='px-4 py-2 border-b text-black'>
									<Link href={`/rentPage/${equipment.constructionEquipId}`} passHref>
										{equipment.description}
									</Link>
								</td>
								<td className='px-4 py-2 border-b text-black'>
									<Link href={`/rentPage/${equipment.constructionEquipId}`} passHref>
										<img src={equipment.zdjecieLink} alt={equipment.name} className='w-20 h-20 object-cover' />
									</Link>
								</td>
								<td className='px-4 py-2 border-b text-black'>
									<button
										onClick={() => handleShowModal(equipment.constructionEquipId)}
										className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md'>
										Usuń
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{showEquipment && equipmentList.length === 0 && <p className='text-black'>Brak sprzętu do wyświetlenia.</p>}

			{/* Modal */}
			{showModal && (
				<div className='fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-lg'>
					<div className='bg-gray-800 text-white p-6 rounded-md'>
						<h2 className='text-xl mb-4'>Potwierdź usunięcie</h2>
						<p>Czy na pewno chcesz usunąć ten sprzęt?</p>
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

export default EquipmentList
