import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './pages/main'
import Message from './pages/message'

function App() {
    useEffect(() => {
        const tg = window.Telegram.WebApp

        tg.ready()

        console.log('Viewport height:', tg.viewportHeight)

        tg.expand() // To'liq ekranga o'chiriladi
    }, [])

    return (
        <div className="h-dvh flex flex-col items-center justify-center bg-blue-500 p-12">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/message" element={<Message />} />
            </Routes>
        </div>
    )
}

export default App
