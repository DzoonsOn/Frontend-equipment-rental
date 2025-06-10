import { FaTimesCircle } from 'react-icons/fa'
import 'animate.css'

const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-[rgba(0,0,0,0.4)] z-50'>
			<div className='bg-white p-8 rounded-3xl shadow-2xl transform transition-all duration-500 scale-110 animate__animated animate__fadeIn animate__faster'>
				<div className='flex items-center justify-center mb-4'>
					<FaTimesCircle className='text-3xl text-blue-800 mr-4 animate__animated animate__bounce' />
					<h3 className='text-xl font-semibold text-blue-800 animate__animated animate__fadeIn animate__delay-1s'>
						{message}
					</h3>
				</div>
				<button
					onClick={onClose}
					className='w-full py-3 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-300 animate__animated animate__bounceIn'>
					Zamknij
				</button>
			</div>
		</div>
	)
}

export default ErrorModal
