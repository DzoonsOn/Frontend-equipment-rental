import { cookies } from 'next/headers'
import NavigationClient from './NavigationClient'

export const NavigationServer = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const role = cookieStore.get('role')?.value
	const isLoggedIn = Boolean(accessToken)

	console.log('access ' + accessToken)

	let hasAccess = false
	if (role === 'ADMIN') {
		hasAccess = true
	}

	console.log(hasAccess)

	return <NavigationClient isLoggedIn={isLoggedIn} isAdmin={hasAccess} />
}

export default NavigationServer
