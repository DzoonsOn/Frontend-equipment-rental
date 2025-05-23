'use client'

import React, { useState } from 'react'

type AddCategoryProps = {
	access_token: string
}

const AddCategory = ({ access_token }: AddCategoryProps) => {
	const [nazwa, setNazwa] = useState('')
	const [opis, setOpis] = useState('')
	const [status, setStatus] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)
		setError(null)

		if (!nazwa.trim() || !opis.trim()) {
			setError('Proszę uzupełnić oba pola')
			return
		}

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
				method: 'POST',
				headers: { accept: '*/*', Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ nazwa, opis }),
			})

			if (!res.ok) {
				const data = await res.json()
				setError(data.message || 'Błąd podczas dodawania kategorii')
				return
			}

			setStatus('Kategoria została dodana pomyślnie!')
			setNazwa('')
			setOpis('')
		} catch (err) {
			setError(`Wystąpił błąd sieciowy: ${err}`)
		}
	}

	return (
		<div className='max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Dodaj nową kategorię</h1>

			<form onSubmit={handleSubmit} className='space-y-6 text-gray-900'>
				<div>
					<label htmlFor='nazwa' className='block mb-2 font-semibold text-gray-700'>
						Nazwa
					</label>
					<input
						type='text'
						id='nazwa'
						value={nazwa}
						onChange={e => setNazwa(e.target.value)}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='opis' className='block mb-2 font-semibold text-gray-700'>
						Opis
					</label>
					<textarea
						id='opis'
						value={opis}
						onChange={e => setOpis(e.target.value)}
						rows={4}
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<button
					type='submit'
					className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition'>
					Dodaj kategorię
				</button>
			</form>

			{status && <p className='mt-4 text-green-600'>{status}</p>}
			{error && <p className='mt-4 text-red-600'>{error}</p>}
		</div>
	)
}

export default AddCategory
