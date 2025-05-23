import { cookies } from 'next/headers'
import AddCategory from '@/components/adminPageComponent/AddCategory'
import AddEquipment from '@/components/adminPageComponent/AddEquipment'

const AdminPage = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const isLoggedIn = Boolean(accessToken)

	return (
		<>
			{isLoggedIn && typeof accessToken === 'string' && <AddCategory access_token={accessToken} />}
			{isLoggedIn && typeof accessToken === 'string' && <AddEquipment access_token={accessToken} />}
		</>
	)
}

export default AdminPage
