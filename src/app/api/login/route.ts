import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST(req: Request) {
	const body = await req.json()
	const { email, password } = body

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/authenticate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({ email, password }),
	})

	if (!response.ok) {
		const errorData = await response.json()
		return NextResponse.json({ message: errorData.message || 'Błąd logowania' }, { status: response.status })
	}

	const data = await response.json()
	const { access_token, refresh_token } = data

	const res = NextResponse.json({ message: 'Zalogowano pomyślnie' })

	// Set cookies using headers
	res.headers.append(
		'Set-Cookie',
		serialize('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
			sameSite: 'lax' as const,
		})
	)
	res.headers.append(
		'Set-Cookie',
		serialize('refresh_token', refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
			sameSite: 'lax' as const,
		})
	)

	return res
}
