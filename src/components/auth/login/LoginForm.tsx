'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaLock } from 'react-icons/fa'
import SignUpPrompt from '@/components/auth/login/SignUpPrompt'
import ForgotPassword from '@/components/auth/login/ForgotPassword'
import SuccessModal from '@/components/modal/SuccessModal'

const LoginForm = () => {
	const [showModal, setShowModal] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
	const [formError, setFormError] = useState<string | null>(null) // Stan do przechowywania globalnego błędu
	const router = useRouter()

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)

		if (errors.password) {
			setErrors(prev => ({ ...prev, password: undefined })) // Usunięcie błędu przy zmianie hasła
		}
	}

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)

		if (errors.email) {
			setErrors(prev => ({ ...prev, email: undefined })) // Usunięcie błędu przy zmianie emaila
		}
	}

	const validate = () => {
		const newErrors: { email?: string; password?: string } = {}

		if (!email.trim()) {
			newErrors.email = 'Adres e-mail jest wymagany.'
		} else if (!/^\S+@\S+\.\S+$/.test(email)) {
			newErrors.email = 'Podaj poprawny adres e-mail.'
		}

		if (!password) {
			newErrors.password = 'Hasło jest wymagane.'
		} else {
			if (password.length < 6) {
				newErrors.password = 'Hasło musi mieć co najmniej 6 znaków.'
			} else if (!/[A-Z]/.test(password)) {
				newErrors.password = 'Hasło musi zawierać przynajmniej jedną wielką literę.'
			} else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
				newErrors.password = 'Hasło musi zawierać przynajmniej jeden znak specjalny.'
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!validate()) return

		try {
			const res = await fetch('api/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Accept: 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (!res.ok) {
				const errorData = await res.json()
				setFormError(errorData.message || 'Błąd logowania')
				return
			}

			// Po poprawnym zalogowaniu ciasteczka HttpOnly są ustawione automatycznie przez serwer,
			// nie masz dostępu do tokenów w JS (co jest bezpieczne)
			setShowModal(true)
			setTimeout(() => {
				setShowModal(false)
				router.push('/')
				router.refresh()
			}, 1000)
		} catch (err) {
			setFormError('Błąd sieci lub serwera: ' + err)
		}
	}

	return (
		<div className='w-full md:w-1/2 p-10'>
			{showModal && (
				<SuccessModal
					message='Pomyślnie zalogowano!'
					onClose={() => {
						setShowModal(false)
						router.push('/login')
					}}
				/>
			)}
			<h2 className='text-2xl font-bold mb-2 text-gray-800'>Zaloguj się</h2>
			<p className='text-sm text-gray-500 mb-6'>
				Zyskaj dostęp do sprzętu budowlanego, historii wypożyczeń i rezerwacji.
			</p>
			{formError && (
				<p className='text-red-600 text-sm mb-4'>
					{formError} {/* Wyświetlanie komunikatu o błędzie */}
				</p>
			)}
			<form onSubmit={handleSubmit} className='space-y-4' noValidate>
				<div className='relative'>
					<FaUser className='absolute top-4 left-3 text-gray-400' />
					<input
						type='email'
						placeholder='e-mail'
						value={email}
						onChange={handleEmailChange}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.email}
						aria-describedby='email-error'
						required
					/>
					{errors.email && (
						<p id='email-error' className='mt-1 text-sm text-red-600'>
							{errors.email}
						</p>
					)}
				</div>

				<div className='relative'>
					<FaLock className='absolute top-4 left-3 text-gray-400' />
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder='Password'
						value={password}
						onChange={handlePasswordChange}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
						aria-invalid={!!errors.password}
						aria-describedby='password-error'
						required
					/>
					<span
						className='absolute right-3 top-4 text-sm text-blue-600 cursor-pointer select-none'
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? 'HIDE' : 'SHOW'}
					</span>
					{errors.password && (
						<p id='password-error' className='mt-1 text-sm text-red-600'>
							{errors.password}
						</p>
					)}
				</div>

				<ForgotPassword />

				<button type='submit' className='bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded'>
					Sign in
				</button>

				<SignUpPrompt />
			</form>
		</div>
	)
}

export default LoginForm
