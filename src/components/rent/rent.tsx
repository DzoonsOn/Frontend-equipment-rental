'use client'
import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import SuccessModal from '../modal/SuccessModal'
import ErrorModal from '../modal/ErrorModal'
import { useRouter } from 'next/navigation'

type RentalFormProps = {
	userId: number
	accessToken: string
}

type RentalFormData = {
	userId: number
	constructionEquipId: number
	dataStart: string
	dataEnd: string
	notes: string
}

const RentalForm = ({ userId, accessToken }: RentalFormProps) => {
	const [constructionEquipId, setConstructionEquipId] = useState<number | null>(null)
	const [dataStart, setDataStart] = useState<Date | null>(null)
	const [dataEnd, setDataEnd] = useState<Date | null>(null)
	const [extraCost, setExtraCost] = useState<number>(0)
	const [notes, setNotes] = useState<string>('')

	const [occupiedDates, setOccupiedDates] = useState<Date[]>([])
	const [errors, setErrors] = useState<{ [key: string]: string }>({})
	const [isClient, setIsClient] = useState(false)
	const [equipmentDetails, setEquipmentDetails] = useState<any>(null)

	const [showModal, setShowModal] = useState(false)
	const [showErrorModal, setShowErrorModal] = useState(false)
	const [showErrorTest, setShowErrorText] = useState('')
	const router = useRouter()

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (constructionEquipId !== null && accessToken) {
			const fetchEquipmentDetails = async () => {
				try {
					const response = await fetch(`http://localhost:8080/api/public/equipment/ById/${constructionEquipId}`, {
						method: 'GET',
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
					})
					if (!response.ok) {
						setShowErrorText('Failed to fetch equipment details')
						setShowErrorModal(true)
						return
					}
					const data = await response.json()
					setEquipmentDetails(data)
				} catch (error) {
					setShowErrorText(`Error fetching equipment details: , ${error}`)
					setShowErrorModal(true)
				}
			}

			fetchEquipmentDetails()
		}
	}, [constructionEquipId, accessToken])

	useEffect(() => {
		if (isClient) {
			const urlParams = new URLSearchParams(window.location.search)
			const itemId = urlParams.get('itemId')
			if (itemId) {
				setConstructionEquipId(Number(itemId))
			}

			const currentDate = new Date()
			setDataStart(currentDate)
			setDataEnd(currentDate)
		}
	}, [isClient])

	useEffect(() => {
		if (constructionEquipId !== null && accessToken) {
			const fetchOccupiedDates = async () => {
				try {
					const response = await fetch(`http://localhost:8080/api/public/rentals/occupied/all/${constructionEquipId}`, {
						method: 'GET',
						headers: {
							accept: 'application/json',
							Authorization: `Bearer ${accessToken}`,
						},
					})
					if (!response.ok) {
						throw new Error('Failed to fetch occupied dates')
					}
					const data = await response.json()
					const dates = data
						.map((item: { start: string; end: string }) => {
							const startDate = new Date(item.start)
							const endDate = new Date(item.end)

							startDate.setHours(12, 0, 0, 0)
							endDate.setHours(12, 0, 0, 0)

							const currentDate = new Date(startDate)
							const occupiedDatesArray: Date[] = []

							while (currentDate <= endDate) {
								occupiedDatesArray.push(new Date(currentDate))
								currentDate.setDate(currentDate.getDate() + 1)
							}

							return occupiedDatesArray
						})
						.flat()
					setOccupiedDates(dates)
				} catch (error) {
					setShowErrorText(`Error fetching occupied dates:, ${error}`)
					setShowErrorModal(true)
				}
			}

			fetchOccupiedDates()
		}
	}, [constructionEquipId, accessToken])

	const handleCalendarChange = (value: Date[]) => {
		if (value && value.length === 2) {
			const [startDate, endDate] = value
			startDate.setHours(12, 0, 0, 0)
			endDate.setHours(12, 0, 0, 0)
			setDataStart(startDate)
			setDataEnd(endDate)
		}
	}

	useEffect(() => {
		if (dataStart && dataEnd && equipmentDetails) {
			const diffInTime = dataEnd.getTime() - dataStart.getTime()
			const diffInDays = diffInTime / (1000 * 3600 * 24) + 1
			const pricePerDay = equipmentDetails.constructionDto.pricePerDay

			const totalCost = pricePerDay * diffInDays
			setExtraCost(totalCost)
		}
	}, [dataStart, dataEnd, equipmentDetails])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrors({})

		const newErrors: { [key: string]: string } = {}

		if (userId <= 0) {
			newErrors.userId = 'Please select a valid user ID.'
		}

		if (constructionEquipId === null || constructionEquipId <= 0) {
			newErrors.constructionEquipId = 'Please select a valid equipment.'
		}

		if (!dataStart || !dataEnd || dataStart >= dataEnd) {
			newErrors.dateRange = 'Please select a valid date range.'
		}

		if (dataStart && dataEnd) {
			const diffInTime = dataEnd.getTime() - dataStart.getTime()
			const diffInDays = diffInTime / (1000 * 3600 * 24)
			if (diffInDays >= 14) {
				newErrors.dateRange = 'Please select a valid date range.'
			}
		}

		if (extraCost < 0) {
			newErrors.extraCost = 'Extra cost cannot be negative.'
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		const rentalData: RentalFormData = {
			userId,
			constructionEquipId: constructionEquipId!,
			dataStart: dataStart!.toISOString().split('T')[0],
			dataEnd: dataEnd!.toISOString().split('T')[0],
			notes,
		}

		try {
			const response = await fetch('http://localhost:8080/api/v1/rentals', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(rentalData),
			})

			if (response.ok) {
				// Check if the response status is 2xx
				setShowModal(true)
			} else {
				const errorData = await response.json() // Get the error message from the response body
				const errorMessage =
					errorData.message || `Failed to create rental, server responded with status: ${response.status}`

				setShowErrorText(errorMessage)
				setShowErrorModal(true)
				throw new Error(errorMessage)
			}
		} catch (error: unknown) {
			// Handle unexpected errors
			if (error instanceof Error) {
				setShowErrorText(`${error.message}`)
				setShowErrorModal(true)
			} else {
				setShowErrorText('Unknown error occurred')
				setShowErrorModal(true)
			}
		}
	}

	const isDateOccupied = (date: Date) => {
		return occupiedDates.some(
			occupiedDate =>
				date.getDate() === occupiedDate.getDate() &&
				date.getMonth() === occupiedDate.getMonth() &&
				date.getFullYear() === occupiedDate.getFullYear()
		)
	}

	if (!isClient) {
		return null
	}

	return (
		<>
			{showErrorModal && <ErrorModal message={showErrorTest} onClose={() => setShowErrorModal(false)} />}
			{showModal && (
				<SuccessModal
					message='Wypożyczono pomyślnie'
					onClose={() => {
						setShowModal(false)
						router.push('/rentPage')
					}}
				/>
			)}
			<form onSubmit={handleSubmit} className='max-w-2xl mx-auto p-6 text-black rounded-lg shadow-xl space-y-6'>
				{equipmentDetails && (
					<div className='flex flex-col items-center space-y-4'>
						<h2 className='text-xl font-semibold'>{equipmentDetails.constructionDto.name}</h2>
						<img
							src={equipmentDetails.constructionDto.zdjecieLink}
							alt={equipmentDetails.constructionDto.name}
							className='w-auto h-52 object-cover rounded-md'
						/>

						<p className='text-sm text-gray-600'>{equipmentDetails.constructionDto.description}</p>
					</div>
				)}

				<div className='flex flex-col mx-auto space-y-2'>
					<label className='font-semibold'>Select Dates</label>
					<Calendar
						selectRange
						onChange={handleCalendarChange}
						value={[dataStart, dataEnd]}
						minDate={new Date()}
						tileDisabled={({ date }) => isDateOccupied(date)}
					/>
					{errors.dateRange && <p className='text-sm text-red-600'>{errors.dateRange}</p>}
				</div>

				<div className='flex flex-col space-y-2'>
					<label htmlFor='extraCost' className='font-semibold'>
						Kwota całkowita
					</label>
					<label className={` p-2 rounded-md ${errors.extraCost ? 'border-red-500' : ''}`}>{extraCost}</label>
					{errors.extraCost && <p className='text-sm text-red-600'>{errors.extraCost}</p>}
				</div>

				<div className='flex flex-col space-y-2'>
					<label htmlFor='notes' className='font-semibold'>
						Notes
					</label>
					<textarea
						id='notes'
						value={notes}
						onChange={e => setNotes(e.target.value)}
						className='border p-2 rounded-md'
						rows={3}
					/>
				</div>

				<button
					type='submit'
					className='w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition'>
					Rent Equipment
				</button>
			</form>
		</>
	)
}

export default RentalForm
