import AuthSidebar from '@/components/auth/AuthSidebar'
import LoginForm from '@/components/auth/login/LoginForm'

export default function LoginPage() {
	return (
		<div className='min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center'>
			<div className='bg-white rounded-xl shadow-lg flex max-w-4xl w-full overflow-hidden'>
				<AuthSidebar header='Witamy!' text='Nowoczesna platforma wynajmu sprzętu'>
					Szybko zarezerwuj koparki, zagęszczarki, rusztowania i więcej. Dostępność w czasie rzeczywistym, przejrzysta
					historia wypożyczeń i pełna kontrola.
				</AuthSidebar>

				<LoginForm />
			</div>
		</div>
	)
}
