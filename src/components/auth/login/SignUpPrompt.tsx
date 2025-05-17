const SignUpPrompt = () => {
	return (
		<p className='text-center text-sm text-gray-500 mt-4'>
			Don’t have an account?{' '}
			<a
				href='/register'
				className="
                  relative
                  text-blue-600
                  hover:underline-none
                  before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-blue-600
                  before:transition-all before:duration-300
                  hover:before:w-full
                  before:content-['']
                ">
				Sign Up
			</a>
		</p>
	)
}

export default SignUpPrompt
