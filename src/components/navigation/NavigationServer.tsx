// app/components/NavigationServer.tsx
import { cookies } from 'next/headers'
import NavigationClient from './NavigationClient'

export default async function NavigationServer() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const isLoggedIn = Boolean(accessToken)

	return <NavigationClient isLoggedIn={isLoggedIn} />
}
