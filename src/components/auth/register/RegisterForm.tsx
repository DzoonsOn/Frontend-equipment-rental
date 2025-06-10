'use client'

import { useState, FormEvent, Dispatch, SetStateAction, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'
import SignUpPrompt from '@/components/auth/register/SignUpPrompt'
import SuccessModal from '@/components/modal/SuccessModal'
import ErrorModal from '@/components/modal/ErrorModal'

const RegisterFrom = () => {
	const [showModal, setShowModal] = useState(false)
	const [showErrorModal, setShowErrorModal] = useState(false)
	const [showErrorTest, setShowErrorText] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [phoneNumber, setNumber] = useState('')

	const [errors, setErrors] = useState<{
		firstName?: string
		lastName?: string
		email?: string
		password?: string
		confirmPassword?: string
		phoneNumber?: string
	}>({})

	const router = useRouter()

	const validate = () => {
		const newErrors: typeof errors = {}

		if (!firstName.trim()) {
			newErrors.firstName = 'Imię jest wymagane.'
		}

		if (!lastName.trim()) {
			newErrors.lastName = 'Nazwisko jest wymagane.'
		}

		if (!email.trim()) {
			newErrors.email = 'Adres e-mail jest wymagany.'
		} else if (!/^\S+@\S+\.\S+$/.test(email)) {
			newErrors.email = 'Podaj poprawny adres e-mail.'
		}

		if (!phoneNumber.trim()) {
			newErrors.phoneNumber = 'Numer telefonu jest wymagany.'
		} else if (!/^\d{9}$/.test(phoneNumber)) {
			newErrors.phoneNumber = 'Numer telefonu musi mieć dokładnie 9 cyfr.'
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

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane.'
		} else if (confirmPassword !== password) {
			newErrors.confirmPassword = 'Hasła muszą być takie same.'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!validate()) return

		try {
			const res = await fetch('api/register/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
			})

			if (!res.ok) {
				const errorData = await res.json()
				setShowErrorText(`Błąd logowania: ${errorData.message || res.statusText}`)
				setShowErrorModal(true)
				return
			}

			setShowModal(true)
			setTimeout(() => {
				setShowModal(false)
				router.push('/login')
			}, 1000)
		} catch (err) {
			setShowErrorText('Błąd sieci lub serwera: ' + err)
			setShowErrorModal(true)
		}
	}

	const handleChangeFactory =
		(field: keyof typeof errors, setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
			setter(e.target.value)
			if (errors[field]) {
				setErrors(prev => ({ ...prev, [field]: undefined }))
			}
		}

	return (
		<div className='w-full md:w-1/2 p-10'>
			{showErrorModal && <ErrorModal message={showErrorTest} onClose={() => setShowErrorModal(false)} />}
			{showModal && (
				<SuccessModal
					message='Pomyślnie zarejestrowano!'
					onClose={() => {
						setShowModal(false)
						router.push('/login')
					}}
				/>
			)}

			<h2 className='text-2xl font-bold mb-2 text-gray-800'>Rejestracja</h2>
			<p className='text-sm text-gray-500 mb-6'>Utwórz nowe konto, aby zacząć korzystać</p>
			<form onSubmit={handleSubmit} className='space-y-4' noValidate>
				<div className='relative'>
					<FaUser className='absolute top-4 left-3 text-gray-400' />
					<input
						type='text'
						placeholder='Imię'
						value={firstName}
						onChange={handleChangeFactory('firstName', setFirstName)}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.firstName ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.firstName}
						aria-describedby='firstName-error'
						required
					/>
					{errors.firstName && (
						<p id='firstName-error' className='mt-1 text-sm text-red-600'>
							{errors.firstName}
						</p>
					)}
				</div>

				<div className='relative'>
					<FaUser className='absolute top-4 left-3 text-gray-400' />
					<input
						type='text'
						placeholder='Nazwisko'
						value={lastName}
						onChange={handleChangeFactory('lastName', setLastName)}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.lastName ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.lastName}
						aria-describedby='lastName-error'
						required
					/>
					{errors.lastName && (
						<p id='lastName-error' className='mt-1 text-sm text-red-600'>
							{errors.lastName}
						</p>
					)}
				</div>

				<div className='relative'>
					<FaEnvelope className='absolute top-4 left-3 text-gray-400' />
					<input
						type='email'
						placeholder='Email'
						value={email}
						onChange={handleChangeFactory('email', setEmail)}
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
					<FaPhone className='absolute top-4 left-3 text-gray-400' />
					<input
						type='text'
						placeholder='Numer telefonu'
						value={phoneNumber}
						onChange={handleChangeFactory('phoneNumber', setNumber)}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.phoneNumber}
						aria-describedby='number-error'
						required
						maxLength={9}
					/>
					{errors.phoneNumber && (
						<p id='number-error' className='mt-1 text-sm text-red-600'>
							{errors.phoneNumber}
						</p>
					)}
				</div>

				<div className='relative'>
					<FaLock className='absolute top-4 left-3 text-gray-400' />
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder='Hasło'
						value={password}
						onChange={handleChangeFactory('password', setPassword)}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.password ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.password}
						aria-describedby='password-error'
						required
					/>
					<span
						className='absolute right-3 top-3 text-sm text-blue-600 cursor-pointer select-none'
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? 'HIDE' : 'SHOW'}
					</span>
					{errors.password && (
						<p id='password-error' className='mt-1 text-sm text-red-600'>
							{errors.password}
						</p>
					)}
				</div>

				<div className='relative'>
					<FaLock className='absolute top-4 left-3 text-gray-400' />
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						placeholder='Potwierdź hasło'
						value={confirmPassword}
						onChange={handleChangeFactory('confirmPassword', setConfirmPassword)}
						className={`w-full pl-10 p-3 border rounded text-gray-900 focus:outline-none ${
							errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
						}`}
						aria-invalid={!!errors.confirmPassword}
						aria-describedby='confirmPassword-error'
						required
					/>
					<span
						className='absolute right-3 top-4 text-sm text-blue-600 cursor-pointer select-none'
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
						{showConfirmPassword ? 'HIDE' : 'SHOW'}
					</span>
					{errors.confirmPassword && (
						<p id='confirmPassword-error' className='mt-1 text-sm text-red-600'>
							{errors.confirmPassword}
						</p>
					)}
				</div>

				<button type='submit' className='bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded'>
					Zarejestruj się
				</button>

				<SignUpPrompt />
			</form>
		</div>
	)
}

export default RegisterFrom
