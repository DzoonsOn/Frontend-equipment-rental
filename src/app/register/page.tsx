import AuthSidebar from '@/components/auth/AuthSidebar'
import RegisterFrom from '@/components/auth/register/RegisterForm'

export default function RegisterPage() {
	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center'>
			<div className='bg-white rounded-xl shadow-lg flex max-w-4xl w-full overflow-hidden'>
				<AuthSidebar header='Witamy!' text='Dołącz do naszej platformy'>
					Rejestruj się, aby mieć dostęp do szerokiego wyboru sprzętu budowlanego, zarządzać wypożyczeniami i
					rezerwacjami.
				</AuthSidebar>

				<RegisterFrom />
			</div>
		</div>
	)
}
