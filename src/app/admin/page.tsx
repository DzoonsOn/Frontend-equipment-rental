import { cookies } from 'next/headers'
import AddCategory from '@/components/adminPageComponent/AddCategory'
import AddEquipment from '@/components/adminPageComponent/AddEquipment'
import UserList from '@/components/adminPageComponent/UserList '
import CategoryList from '@/components/adminPageComponent/CategoryList'
import EquipmentList from '@/components/adminPageComponent/EquipmentList'

const AdminPage = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value
	const isLoggedIn = Boolean(accessToken)

	return (
		<>
			{isLoggedIn && typeof accessToken === 'string' && <UserList access_token={accessToken} />}
			{isLoggedIn && typeof accessToken === 'string' && <CategoryList access_token={accessToken} />}
			{isLoggedIn && typeof accessToken === 'string' && <EquipmentList access_token={accessToken} />}

			{isLoggedIn && typeof accessToken === 'string' && <AddCategory access_token={accessToken} />}
			{isLoggedIn && typeof accessToken === 'string' && <AddEquipment access_token={accessToken} />}
		</>
	)
}

export default AdminPage
