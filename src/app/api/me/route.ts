import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value

	// Logowanie tokenu
	console.log('Access Token:', accessToken)

	if (!accessToken) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
	}

	return NextResponse.json({ message: 'Authenticated' }, { status: 200 })
}
