'use client'

import React, { useState } from 'react'

type AddEquipmentProps = {
	access_token: string
}

const AddEquipment = ({ access_token }: AddEquipmentProps) => {
	const [idkategoria, setIdkategoria] = useState<number>(0)
	const [nazwaSprzetu, setNazwaSprzetu] = useState('')
	const [uprawnienia, setUprawnienia] = useState('')
	const [kwotaZaDzien, setKwotaZaDzien] = useState<number>(0)
	const [zdjecieLink, setZdjecieLink] = useState('')

	const [successMsg, setSuccessMsg] = useState<string | null>(null)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSuccessMsg(null)
		setErrorMsg(null)

		if (!nazwaSprzetu.trim() || !uprawnienia.trim() || !zdjecieLink.trim()) {
			setErrorMsg('Proszę uzupełnić wszystkie pola tekstowe')
			return
		}
		if (idkategoria <= 0 || kwotaZaDzien <= 0) {
			setErrorMsg('Id kategorii i kwota za dzień muszą być większe od zera')
			return
		}

		try {
			const res = await fetch(`http://localhost:8080/api/v1/equipment`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
					Authorization: `Bearer ${access_token}`,
				},
				body: JSON.stringify({
					name: nazwaSprzetu,
					permission: uprawnienia,
					pricePerDay: kwotaZaDzien,
					zdjecieLink: zdjecieLink,
					categoryId: idkategoria,
				}),
			})

			if (!res.ok) {
				const data = await res.json()
				setErrorMsg(data.message || 'Błąd podczas dodawania sprzętu')
				return
			}

			setSuccessMsg('Sprzęt został dodany pomyślnie!')
			// reset form
			setIdkategoria(0)
			setNazwaSprzetu('')
			setUprawnienia('')
			setKwotaZaDzien(0)
			setZdjecieLink('')
		} catch (err) {
			setErrorMsg(`Wystąpił błąd sieciowy: ${err}`)
		}
	}

	return (
		<div className='max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 text-black'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Dodaj nowy sprzęt</h1>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div>
					<label htmlFor='idkategoria' className='block mb-2 font-semibold text-gray-700'>
						ID Kategorii
					</label>
					<input
						type='number'
						id='idkategoria'
						value={idkategoria}
						onChange={e => setIdkategoria(Number(e.target.value))}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='nazwaSprzetu' className='block mb-2 font-semibold text-gray-700'>
						Nazwa sprzętu
					</label>
					<input
						type='text'
						id='nazwaSprzetu'
						value={nazwaSprzetu}
						onChange={e => setNazwaSprzetu(e.target.value)}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='uprawnienia' className='block mb-2 font-semibold text-gray-700'>
						Uprawnienia
					</label>
					<input
						type='text'
						id='uprawnienia'
						value={uprawnienia}
						onChange={e => setUprawnienia(e.target.value)}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>
				<div>
					<label htmlFor='kwotaZaDzien' className='block mb-2 font-semibold text-gray-700'>
						Kwota za dzień
					</label>
					<input
						type='number'
						id='kwotaZaDzien'
						value={kwotaZaDzien}
						onChange={e => setKwotaZaDzien(Number(e.target.value))}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						min={0}
						step='0.01'
						required
					/>
				</div>

				<div>
					<label htmlFor='zdjecieLink' className='block mb-2 font-semibold text-gray-700'>
						Link do zdjęcia
					</label>
					<input
						type='text'
						id='zdjecieLink'
						value={zdjecieLink}
						onChange={e => setZdjecieLink(e.target.value)}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<button
					type='submit'
					className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
					Dodaj sprzęt
				</button>
			</form>

			{successMsg && <p className='mt-4 text-green-600'>{successMsg}</p>}
			{errorMsg && <p className='mt-4 text-red-600'>{errorMsg}</p>}
		</div>
	)
}

export default AddEquipment
