import { NextResponse } from 'next/server'
// import { serialize } from 'cookie'

export async function POST(req: Request) {
	const body = await req.json()
	const { firstName, lastName, email, password, phoneNumber } = body

	const role = process.env.NEXT_PUBLIC_USER

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({ firstName, lastName, email, phoneNumber, password, role }),
	})

	if (!response.ok) {
		let message = 'Błąd logowania'
		try {
			const errorData = await response.json()
			console.error('Błąd walidacji:', errorData)

			if (errorData.message) {
				message = errorData.message
			} else {
				message = Object.values(errorData).join('\n')
			}
		} catch (e) {
			console.warn('Nie udało się sparsować odpowiedzi błędu jako JSON:', e)
		}

		return NextResponse.json({ message }, { status: response.status })
	}

	// const data = await response.json()
	// const { access_token, refresh_token, userId,  } = data

	const res = NextResponse.json({ message: 'Zarejestrowano pomyślnie' })

	// res.headers.append(
	// 	'Set-Cookie',
	// 	serialize('access_token', access_token, {
	// 		httpOnly: true,
	// 		secure: process.env.NODE_ENV === 'production',
	// 		maxAge: 60 * 60 * 24 * 7,
	// 		path: '/',
	// 		sameSite: 'lax',
	// 	})
	// )
	// res.headers.append(
	// 	'Set-Cookie',
	// 	serialize('refresh_token', refresh_token, {
	// 		httpOnly: true,
	// 		secure: process.env.NODE_ENV === 'production',
	// 		maxAge: 60 * 60 * 24 * 7,
	// 		path: '/',
	// 		sameSite: 'lax',
	// 	})
	// )

	// res.headers.append(
	// 	'Set-Cookie',
	// 	serialize('userId', userId, {
	// 		httpOnly: false,
	// 		secure: process.env.NODE_ENV === 'production',
	// 		maxAge: 60 * 60 * 24 * 7,
	// 		path: '/',
	// 		sameSite: 'lax',
	// 	})
	// )

	// res.headers.append(
	// 	'Set-Cookie',
	// 	serialize('role', role, {
	// 		httpOnly: false,
	// 		secure: process.env.NODE_ENV === 'production',
	// 		maxAge: 60 * 60 * 24 * 7,
	// 		path: '/',
	// 		sameSite: 'lax',
	// 	})
	// )

	return res
}
