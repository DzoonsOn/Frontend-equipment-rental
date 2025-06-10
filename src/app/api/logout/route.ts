import { NextResponse } from 'next/server'
import { serialize, type SerializeOptions } from 'cookie'

export async function POST() {
	const expiredCookieOptions: SerializeOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0,
		path: '/',
		sameSite: 'lax',
	}

	const res = NextResponse.json({ message: 'Wylogowano pomyślnie' })

	res.headers.append('Set-Cookie', serialize('access_token', '', expiredCookieOptions))
	res.headers.append('Set-Cookie', serialize('refresh_token', '', expiredCookieOptions))
	res.headers.append('Set-Cookie', serialize('userId', '', expiredCookieOptions))
	res.headers.append('Set-Cookie', serialize('role', '', expiredCookieOptions))

	return res
}
