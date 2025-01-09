import { Link } from 'react-router-dom'

const Main = () => {
    return (
        <div>
            <h1 className="text-6xl font-bold text-white drop-shadow-md">
                UTAX <span className="text-yellow-500">Messenger</span>
            </h1>

            <div className="flex flex-col gap-4 mt-12 md:flex-row md:gap-8 md:justify-center">
                <Link
                    to={'/message'}
                    className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full md:w-80 text-lg font-semibold text-blue-500 hover:text-blue-700 hover:bg-gray-100 transition-all duration-300"
                >
                    Oddiy xabar yuborish
                </Link>
                <Link
                    to={'/photo'}
                    className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full md:w-80 text-lg font-semibold text-green-500 hover:text-green-700 hover:bg-gray-100 transition-all duration-300"
                >
                    Rasmli xabar yuborish
                </Link>
                <Link
                    to={'/groups'}
                    className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full md:w-80 text-lg font-semibold text-yellow-500 hover:text-yellow-700 hover:bg-gray-100 transition-all duration-300"
                >
                    Bot a&apos;zo bo&apos;lgan guruhlar
                </Link>
            </div>
        </div>
    )
}

export default Main
