import { NextResponse } from 'next/server'
import { serialize, type SerializeOptions } from 'cookie'

export async function POST() {
	const expiredCookieOptions: SerializeOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0, // usuwa ciasteczka natychmiast
		path: '/',
		sameSite: 'lax', // literal string, pasuje do typu
	}

	const res = NextResponse.json({ message: 'Wylogowano pomyślnie' })

	res.headers.append('Set-Cookie', serialize('access_token', '', expiredCookieOptions))
	res.headers.append('Set-Cookie', serialize('refresh_token', '', expiredCookieOptions))

	return res
}
