const ForgotPassword = () => {
	return (
		<div className='flex items-center justify-between text-sm'>
			<label className='flex text-gray-400 items-center gap-2'>
				<input type='checkbox' className='accent-blue-600' />
				Remember me
			</label>
			<a
				href='#'
				className="relative
                  text-blue-600
                  hover:underline-none
                  before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-blue-600
                  before:transition-all before:duration-300
                  hover:before:w-full
                  before:content-['']">
				Forgot Password?
			</a>
		</div>
	)
}

export default ForgotPassword
