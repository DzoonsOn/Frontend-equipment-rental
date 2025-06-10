import { cookies } from 'next/headers'
import ProfileComponent from '@/components/profile/ProfileComonent'

export const Profile = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const id = cookieStore.get('userId')?.value
	const isLoggedIn = Boolean(accessToken)

	const idNum = id ? Number(id) : undefined

	return (
		<>
			<ProfileComponent hasAccess={isLoggedIn} userId={idNum} access_token={accessToken} />
		</>
	)
}

export default Profile
