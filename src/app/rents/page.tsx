// app/rents/page.tsx
import RentalForm from '@/components/rent/rent'
import { cookies } from 'next/headers'

export const Rents = async () => {
	// Sprawdź cookie na serwerze
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const userId = Number(cookieStore.get('userId')?.value)

	// Przekaż dane do komponentu
	if (accessToken && userId) {
		return <RentalForm userId={userId} accessToken={accessToken} />
	}

	return null
}

export default Rents
