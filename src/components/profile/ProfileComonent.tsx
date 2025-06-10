'use client'

import { useEffect, useState } from 'react'
import {
	FaUser,
	FaEnvelope,
	FaPhone,
	FaIdBadge,
	FaUserTag,
	FaLock,
	FaSave,
	FaTimes,
	FaEye,
	FaEyeSlash,
} from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type UserDto = {
	userId: number
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	role: string
}

type ChangePasswordRequest = {
	currentPassword: string
	newPassword: string
	confirmationPassword: string
}

type ProfileComponentProps = {
	hasAccess: boolean
	userId?: number
	access_token?: string
}

const ProfileComponent = ({ hasAccess, userId, access_token }: ProfileComponentProps) => {
	const [user, setUser] = useState<UserDto | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showChangePassword, setShowChangePassword] = useState(false)
	const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
		currentPassword: '',
		newPassword: '',
		confirmationPassword: '',
	})
	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
	const [passwordLoading, setPasswordLoading] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (!hasAccess || !userId || !access_token) return

		setLoading(true)
		setError(null)

		fetch(`http://localhost:8080/api/v1/users/${userId}`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})
			.then(res => {
				if (!res.ok) {
					console.error('Fetch error:', res.status, res.statusText)
					throw new Error(`Błąd podczas pobierania danych: ${res.status} ${res.statusText}`)
				}
				return res.json()
			})
			.then((data: UserDto) => {
				setUser(data)
				setLoading(false)
			})
			.catch(err => {
				setError(err.message)
				setLoading(false)
			})
	}, [hasAccess, userId, access_token])

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
	}

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setPasswordError(null)
		setPasswordSuccess(null)

		if (passwordData.newPassword !== passwordData.confirmationPassword) {
			setPasswordError('Nowe hasła muszą być takie same.')
			return
		}

		setPasswordLoading(true)

		try {
			const formData = new FormData()
			formData.append('currentPassword', passwordData.currentPassword)
			formData.append('newPassword', passwordData.newPassword)
			formData.append('confirmationPassword', passwordData.confirmationPassword)

			const res = await fetch('http://localhost:8080/api/v1/users', {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				body: formData,
			})

			if (!res.ok) {
				const errorText = await res.text()
				setPasswordError(`Błąd podczas zmiany hasła: ${res.status} ${errorText}`)
				throw new Error(errorText)
			}

			let data
			try {
				data = await res.json()
				console.log(data)
			} catch (jsonError) {
				console.error('Failed to parse JSON:', jsonError)
				setPasswordError('Nie udało się przetworzyć odpowiedzi serwera.')
				return
			}

			setPasswordSuccess('Hasło zostało zmienione pomyślnie!')
			setShowLogoutModal(true)
			setPasswordData({ currentPassword: '', newPassword: '', confirmationPassword: '' })
			setShowChangePassword(false)

			setTimeout(() => {
				handleLogout()
			}, 2000)
		} catch (error) {
			setPasswordError(error instanceof Error ? error.message : 'Wystąpił błąd przy próbie zmiany hasła')
		} finally {
			setPasswordLoading(false)
		}
	}

	const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmationPassword') => {
		if (field === 'currentPassword') {
			setShowCurrentPassword(!showCurrentPassword)
		} else if (field === 'newPassword') {
			setShowNewPassword(!showNewPassword)
		} else if (field === 'confirmationPassword') {
			setShowConfirmationPassword(!showConfirmationPassword)
		}
	}

	const handleLogout = async () => {
		try {
			// Make the API call to logout
			const res = await fetch('/api/logout', {
				method: 'POST',
			})

			// Check if the response is ok (successful)
			if (res.ok) {
				// Redirect to login page after successful logout

				router.push('/login')
				router.refresh()
			} else {
				throw new Error('Failed to log out')
			}
		} catch (error) {
			console.error('Error logging out:', error)
			setPasswordError('Wystąpił błąd podczas wylogowywania')
		}
	}

	if (!hasAccess) {
		return <p className='text-red-600 font-semibold text-center mt-8'>Brak dostępu do danych użytkownika.</p>
	}

	if (loading) {
		return <p className='text-blue-600 font-semibold text-center mt-8'>Ładowanie danych...</p>
	}

	if (error) {
		return <p className='text-red-600 font-semibold text-center mt-8'>Błąd: {error}</p>
	}

	if (!user) {
		return <p className='text-gray-600 italic text-center mt-8'>Brak danych użytkownika.</p>
	}

	return (
		<div className='max-w-5xl my-20 mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col md:flex-row gap-12'>
			{/* User Profile Information */}
			<div className='flex-1'>
				<h2 className='text-4xl font-extrabold mb-10 text-blue-600 tracking-tight drop-shadow-sm text-center md:text-left'>
					Profil użytkownika
				</h2>

				<div className='space-y-8 text-gray-900'>
					{/* Mapping user info */}
					{[
						{
							icon: <FaIdBadge className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'ID',
							value: user.userId,
						},
						{
							icon: <FaUser className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'Imię',
							value: user.firstName,
						},
						{
							icon: <FaUser className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'Nazwisko',
							value: user.lastName,
						},
						{
							icon: <FaEnvelope className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'Email',
							value: (
								<a
									href={`mailto:${user.email}`}
									className='underline hover:text-blue-500 transition-colors duration-300'
									title='Wyślij email'>
									{user.email}
								</a>
							),
						},
						{
							icon: <FaPhone className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'Telefon',
							value: (
								<a
									href={`tel:${user.phoneNumber}`}
									className='underline hover:text-blue-500 transition-colors duration-300'
									title='Zadzwoń'>
									{user.phoneNumber}
								</a>
							),
						},
						{
							icon: <FaUserTag className='bg-blue-100 p-3 rounded-full text-blue-600 shadow-md w-10 h-10' />,
							label: 'Rola',
							value: user.role,
						},
					].map(({ icon, label, value }) => (
						<div
							key={label}
							className='flex items-center gap-6 bg-white rounded-2xl px-6 py-4 shadow-md ring-1 ring-blue-200 hover:ring-blue-400 transition-all duration-300 cursor-default select-text'>
							{icon}
							<div className='flex flex-col'>
								<span className='text-xs font-semibold text-blue-400 tracking-wide uppercase'>{label}</span>
								<span className='text-xl font-semibold'>{value}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Change Password Form */}
			<div className='flex-1 bg-white rounded-3xl shadow-lg p-8 relative'>
				<button
					className={`absolute top-6 right-6 rounded-full p-2 text-white transition ${
						showChangePassword ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
					} focus:outline-none focus:ring-4 focus:ring-blue-300`}
					onClick={() => setShowChangePassword(!showChangePassword)}>
					{showChangePassword ? <FaTimes size={20} /> : <FaLock size={20} />}
				</button>

				<h3 className='text-2xl font-semibold text-blue-700 mb-8 text-center'>Zmiana hasła</h3>

				{showChangePassword && (
					<form onSubmit={handlePasswordSubmit} className='space-y-6 max-w-md mx-auto text-black' noValidate>
						<div className='relative'>
							<label htmlFor='currentPassword' className='block text-black font-semibold mb-2'>
								Aktualne hasło
							</label>
							<input
								type={showCurrentPassword ? 'text' : 'password'}
								id='currentPassword'
								name='currentPassword'
								value={passwordData.currentPassword}
								onChange={handlePasswordChange}
								required
								className='w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
								autoComplete='current-password'
							/>
							<button
								type='button'
								className='absolute right-4 top-10'
								onClick={() => togglePasswordVisibility('currentPassword')}>
								{showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
							</button>
						</div>

						<div className='relative'>
							<label htmlFor='newPassword' className='block text-black font-semibold mb-2'>
								Nowe hasło
							</label>
							<input
								type={showNewPassword ? 'text' : 'password'}
								id='newPassword'
								name='newPassword'
								value={passwordData.newPassword}
								onChange={handlePasswordChange}
								required
								className='w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
								autoComplete='new-password'
							/>
							<button
								type='button'
								className='absolute right-4 top-10'
								onClick={() => togglePasswordVisibility('newPassword')}>
								{showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
							</button>
						</div>

						<div className='relative'>
							<label htmlFor='confirmationPassword' className='block text-black font-semibold mb-2'>
								Potwierdź nowe hasło
							</label>
							<input
								type={showConfirmationPassword ? 'text' : 'password'}
								id='confirmationPassword'
								name='confirmationPassword'
								value={passwordData.confirmationPassword}
								onChange={handlePasswordChange}
								required
								className='w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
								autoComplete='new-password'
							/>
							<button
								type='button'
								className='absolute right-4 top-10'
								onClick={() => togglePasswordVisibility('confirmationPassword')}>
								{showConfirmationPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
							</button>
						</div>

						{passwordError && <p className='text-red-600 font-semibold'>{passwordError}</p>}
						{passwordSuccess && <p className='text-green-600 font-semibold'>{passwordSuccess}</p>}

						<button
							type='submit'
							disabled={passwordLoading}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
							<FaSave /> {passwordLoading ? 'Zmieniam hasło...' : 'Zmień hasło'}
						</button>
					</form>
				)}
			</div>

			{showLogoutModal && (
				<div className='fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-md'>
					<div className='bg-blue-600 p-6 rounded-xl shadow-xl'>
						<h3 className='text-xl text-center font-semibold text-white'>Trwa wylogowywanie...</h3>
						<p className='text-center mt-4 text-white'>Proszę poczekać, aż zostaniesz wylogowany.</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProfileComponent
