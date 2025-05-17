type AuthSidebarProps = {
	header: string
	text: string
	children?: string
}

const AuthSidebar = ({ header, text, children }: AuthSidebarProps) => {
	return (
		<div className='bg-gradient-to-b from-blue-600 to-blue-800 text-white p-12 w-1/2 relative hidden md:flex flex-col justify-center'>
			<h1 className='text-4xl font-bold mb-4'>{header}</h1>
			<h2 className='text-lg mb-4 uppercase tracking-wide'>{text}</h2>
			<p className='text-sm text-blue-100'>{children}</p>
			<div className='absolute -bottom-10 -right-10 bg-blue-700 w-40 h-40 rounded-full blur-xl opacity-30' />
		</div>
	)
}

export default AuthSidebar
