'use client'

import React, { useState } from 'react'

type User = {
	userId: string
	firstName: string
	lastName: string
	email: string
	role: string
}

type UserListProps = {
	access_token: string
}

const UserList = ({ access_token }: UserListProps) => {
	const [users, setUsers] = useState<User[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [showUsers, setShowUsers] = useState<boolean>(false)

	// Fetch users from the API
	const fetchUsers = async () => {
		setLoading(true)
		try {
			const res = await fetch(`http://localhost:8080/api/v1/users`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (!res.ok) {
				const data = await res.json()
				setError(data.message || 'Błąd podczas pobierania użytkowników')
				return
			}

			const data = await res.json()
			setUsers(data)
		} catch (err) {
			setError(`Wystąpił błąd sieciowy: ${err}`)
		} finally {
			setLoading(false)
		}
	}

	// Toggle visibility of users list
	const toggleUsers = () => {
		setShowUsers(!showUsers)
		if (!showUsers) {
			fetchUsers()
		}
	}

	return (
		<div className='max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12'>
			<h1 className='text-3xl font-bold mb-6 text-blue-700'>Lista użytkowników</h1>

			{/* Button to show/hide users list */}
			<button
				onClick={toggleUsers}
				className='bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition mb-6'>
				{showUsers ? 'Ukryj użytkowników' : 'Pokaż użytkowników'}
			</button>

			{/* Loading, Error, and Users Table */}
			{loading && <p className='text-black'>Ładowanie...</p>}
			{error && <p className='text-red-600'>{error}</p>}

			{showUsers && !loading && !error && users.length > 0 && (
				<table className='min-w-full table-auto'>
					<thead>
						<tr className='bg-blue-100'>
							<th className='px-4 py-2 border-b text-left text-black'>ID</th>
							<th className='px-4 py-2 border-b text-left text-black'>Imię</th>
							<th className='px-4 py-2 border-b text-left text-black'>Nazwisko</th>
							<th className='px-4 py-2 border-b text-left text-black'>E-mail</th>
							<th className='px-4 py-2 border-b text-left text-black'>Rola</th>
						</tr>
					</thead>
					<tbody>
						{users.map(user => (
							<tr key={user.userId} className='hover:bg-gray-100'>
								<td className='px-4 py-2 border-b text-black'>{user.userId}</td>
								<td className='px-4 py-2 border-b text-black'>{user.firstName}</td>
								<td className='px-4 py-2 border-b text-black'>{user.lastName}</td>
								<td className='px-4 py-2 border-b text-black'>{user.email}</td>
								<td className='px-4 py-2 border-b text-black'>{user.role}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{/* If no users are available */}
			{showUsers && users.length === 0 && <p className='text-black'>Brak użytkowników do wyświetlenia.</p>}
		</div>
	)
}

export default UserList
