import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
	const cookieStore = await cookies() // ← DODAJ await
	const accessToken = cookieStore.get('access_token')?.value

	if (!accessToken) {
		redirect('/login')
	}

	return <div>{accessToken}</div>
}
