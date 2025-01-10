import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ActiveMessages from './pages/active-messages'
import Group from './pages/group'
import Main from './pages/main'
import Message from './pages/message'
import Photo from './pages/photo'

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
                <Route path="/photo" element={<Photo />} />
                <Route path="/group" element={<Group />} />
                <Route path="/active" element={<ActiveMessages />} />
            </Routes>
        </div>
    )
}

export default App
