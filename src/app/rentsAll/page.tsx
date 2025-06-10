import RentalComponent from '@/components/rent/ActiveAndEnded'
import { cookies } from 'next/headers'

export const RentsAll = async () => {
	// Sprawdź cookie na serwerze
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const userId = Number(cookieStore.get('userId')?.value)

	// Przekaż dane do komponentu
	if (accessToken && userId) {
		return <RentalComponent userId={userId} />
	}

	return null
}

export default RentsAll
