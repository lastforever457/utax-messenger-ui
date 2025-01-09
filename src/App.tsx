import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ActiveMessages from './pages/active-messages'
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
        <div className="min-h-dvh px-5 py-10 flex flex-col items-center justify-center bg-blue-500">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/message" element={<Message />} />
                <Route path="/photo" element={<div>Photo</div>} />
                <Route path="/active" element={<ActiveMessages />} />
            </Routes>
        </div>
    )
}

export default App
