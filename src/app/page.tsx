import Image from 'next/image'
import Link from 'next/link'

const categories = [
	{
		title: 'Maszyny budowlane',
		description: 'Wynajmij koparki, walce, ładowarki i więcej.',
		imageUrl: 'https://bialecki.pl/wp-content/uploads/2023/02/10.png',
		path: '/rentPage/2',
	},
	{
		title: 'Ciężkie maszyny budowlane',
		description: 'Koparki, ładowarki, walce drogowe i inne maszyny do dużych prac ziemnych.',
		imageUrl: 'https://cdn.pixabay.com/photo/2020/09/09/20/59/bulldozer-5558681_960_720.jpg',
		path: '/rentPage/4',
	},
	{
		title: 'Sprzęt wyburzeniowy',
		description: 'Młoty hydrauliczne, kruszarki, nożyce wyburzeniowe i inne urządzenia do rozbiórek.',
		imageUrl: 'https://cdn.pixabay.com/photo/2020/04/28/18/19/crack-5105757_960_720.jpg',
		path: '/rentPage/8',
	},
]

const Home = () => {
	return (
		<main className='min-h-screen bg-white py-12'>
			<section className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-12 lg:mb-28'>
				<h1 className='text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 text-blue-700 drop-shadow-md'>
					Twoja Profesjonalna Wypożyczalnia Sprzętu
				</h1>
				<p className='text-xl text-blue-900 max-w-3xl mx-auto leading-relaxed'>
					Wynajmij niezawodny sprzęt budowlany, ogrodniczy i transportowy na każdą okazję. Sprawdź naszą ofertę i
					skontaktuj się z nami już dziś!
				</p>
				<div className='mt-8'>
					<Link href='/rentPage'>
						<button className='bg-blue-600 text-white px-8 py-3 text-lg rounded-xl shadow-md hover:bg-blue-700 transition duration-300'>
							Sprawdź ofertę
						</button>
					</Link>
				</div>
			</section>

			<section className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 lg:mb-32 px-4 sm:px-6 lg:px-8 items-center'>
				{categories.map((cat, idx) => {
					const isCenter = idx === 1
					const isLeft = idx === 0
					const isRight = idx === 2

					const containerClass = `
      flex flex-col items-center text-center
      bg-white rounded-xl shadow-lg p-6
      border border-gray-200
      transition-transform duration-300
      ${isCenter ? 'scale-105 z-10' : 'scale-95 opacity-90'}
      ${isCenter ? '' : 'hover:opacity-100 hover:scale-100'}
      ${isLeft ? 'hover:rotate-[-3deg]' : ''}
      ${isRight ? 'hover:rotate-[3deg]' : ''}
    `
					const imageClass = `
      relative
      rounded-full overflow-hidden shadow-xl border-4 border-gray-200 mb-6
      ${isCenter ? 'w-96 h-96' : 'w-72 h-72'}
    `
					const titleClass = `${isCenter ? 'text-3xl font-bold mb-4' : 'text-2xl font-semibold mb-3'} text-gray-900`
					const descClass = `${isCenter ? 'text-lg mb-6' : 'text-base mb-4'} text-gray-800`
					const linkClass = `
      bg-blue-600 text-white px-6 py-3 rounded-lg
      hover:bg-blue-700 transition duration-300
      w-full max-w-xs
    `

					return (
						<div key={idx} className={containerClass}>
							<div className={imageClass}>
								<Image
									src={cat.imageUrl}
									alt={cat.title}
									fill
									sizes={isCenter ? '384px' : '288px'}
									className='object-cover'
									priority
								/>
							</div>
							<h3 className={titleClass}>{cat.title}</h3>
							<p className={descClass}>{cat.description}</p>
							<Link href={cat.path} className={linkClass}>
								Zobacz więcej
							</Link>
						</div>
					)
				})}
			</section>

			<section className='w-full bg-blue-50 py-6 px-6 sm:px-12 mb-12 lg:mb-28  shadow-inner border border-blue-100'>
				<div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-10'>
					<div className='text-left max-w-xl'>
						<h2 className='text-3xl font-extrabold text-blue-900 mb-3'>MaxBUD — Twój partner w budowie</h2>
						<p className='text-blue-800 text-lg leading-relaxed'>
							Oferujemy nowoczesny i sprawdzony sprzęt dla profesjonalistów. Zaufało nam już setki firm budowlanych w
							całej Polsce.
						</p>
					</div>

					<div className='bg-white p-3 rounded-xl shadow-lg'>
						<Image
							src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.skanska.pl'
							alt='Kod QR do strony firmy'
							width={200}
							height={200}
							className='rounded-lg'
						/>
					</div>
				</div>
			</section>

			<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12'>
				<section className='text-center max-w-4xl mx-auto mb-12 lg:mb-28'>
					<h2 className='text-3xl font-extrabold mb-6 text-blue-900'>Dlaczego warto nas wybrać?</h2>
					<p className='text-blue-800 text-lg leading-relaxed'>
						Nasza wypożyczalnia to połączenie doświadczenia, profesjonalizmu i elastycznego podejścia do klienta.
						Zapewniamy najwyższej jakości sprzęt, konkurencyjne ceny oraz fachową pomoc techniczną.
					</p>
				</section>

				<section className='bg-blue-100 rounded-3xl py-14 px-8 text-center shadow-md border border-blue-200'>
					<h3 className='text-3xl font-extrabold mb-6 text-blue-900'>Gotowy na wynajem?</h3>
					<p className='text-lg text-blue-800 mb-8 leading-relaxed'>
						Skontaktuj się z nami i zarezerwuj sprzęt już teraz.
					</p>
					<Link href='/contact'>
						<button className='relative bg-blue-600 text-white px-8 py-3 text-lg rounded-xl shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none'>
							Skontaktuj się
						</button>
					</Link>
				</section>
			</div>
		</main>
	)
}

export default Home
