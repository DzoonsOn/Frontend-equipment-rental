import Image from 'next/image'
import Link from 'next/link'

const categories = [
	{
		title: 'Maszyny budowlane',
		description: 'Wynajmij koparki, walce, ładowarki i więcej.',
		imageUrl: 'https://bialecki.pl/wp-content/uploads/2023/02/10.png',
	},
	{
		title: 'Ciężkie maszyny budowlane',
		description: 'Koparki, ładowarki, walce drogowe i inne maszyny do dużych prac ziemnych.',
		imageUrl: 'https://cdn.pixabay.com/photo/2020/09/09/20/59/bulldozer-5558681_960_720.jpg',
	},
	{
		title: 'Sprzęt wyburzeniowy',
		description: 'Młoty hydrauliczne, kruszarki, nożyce wyburzeniowe i inne urządzenia do rozbiórek.',
		imageUrl: 'https://cdn.pixabay.com/photo/2020/04/28/18/19/crack-5105757_960_720.jpg',
	},
]

const Home = () => {
	return (
		<main className='min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<section className='text-center mb-20'>
					<h1 className='text-5xl font-bold tracking-tight sm:text-6xl mb-6 text-gray-900'>
						Twoja Profesjonalna Wypożyczalnia Sprzętu
					</h1>
					<p className='text-xl text-gray-800 max-w-3xl mx-auto'>
						Wynajmij niezawodny sprzęt budowlany, ogrodniczy i transportowy na każdą okazję. Sprawdź naszą ofertę i
						skontaktuj się z nami już dziś!
					</p>
					<div className='mt-6'>
						<Link href={'/rentPage'}>
							<button className='bg-blue-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-700 transition'>
								Sprawdź ofertę
							</button>
						</Link>
					</div>
				</section>

				<section className='grid grid-cols-1 md:grid-cols-3 gap-16 mb-20'>
					{categories.map((cat, index) => (
						<div key={index} className='flex flex-col items-center text-center'>
							<div className='relative w-80 h-80 rounded-full overflow-hidden shadow-xl border-4 border-gray-200 mb-6'>
								<Image src={cat.imageUrl} alt={cat.title} fill sizes='320px' className='object-cover' priority />
							</div>
							<h3 className='text-2xl font-semibold mb-3 text-gray-900'>{cat.title}</h3>
							<p className='text-gray-800 mb-4 text-lg'>{cat.description}</p>
							<button className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
								Zobacz więcej
							</button>
						</div>
					))}
				</section>

				<section className='text-center max-w-4xl mx-auto mb-20'>
					<h2 className='text-3xl font-bold mb-4 text-gray-900'>Dlaczego warto nas wybrać?</h2>
					<p className='text-gray-800 text-lg'>
						Nasza wypożyczalnia to połączenie doświadczenia, profesjonalizmu i elastycznego podejścia do klienta.
						Zapewniamy najwyższej jakości sprzęt, konkurencyjne ceny oraz fachową pomoc techniczną.
					</p>
				</section>

				<section className='bg-blue-100 rounded-2xl py-12 px-6 text-center'>
					<h3 className='text-2xl font-bold mb-4 text-gray-900'>Gotowy na wynajem?</h3>
					<p className='text-lg text-gray-800 mb-6'>Skontaktuj się z nami i zarezerwuj sprzęt już teraz.</p>
					<Link href={'/contact'}>
						<button className='bg-blue-600 text-white px-6 py-3 text-lg rounded-xl hover:bg-blue-700 transition'>
							Skontaktuj się
						</button>
					</Link>
				</section>
			</div>
		</main>
	)
}

export default Home
