import { cookies } from 'next/headers'
import NavigationClient from './NavigationClient'

async function fetchAdminData(access_token: string): Promise<boolean> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})

		return res.ok
	} catch (error) {
		console.warn('fetchAdminData error:', error)
		return false
	}
}

export const NavigationServer = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const isLoggedIn = Boolean(accessToken)

	console.log('access ' + accessToken)

	let hasAccess = false
	if (accessToken) {
		hasAccess = await fetchAdminData(accessToken)
	}

	console.log(hasAccess)

	return <NavigationClient isLoggedIn={isLoggedIn} isAdmin={hasAccess} />
}

export default NavigationServer
