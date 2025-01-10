import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ActiveMessages from './pages/active-messages'
import Group from './pages/group'
import Main from './pages/main'
import Message from './pages/message'
import Photo from './pages/photo'

function App() {
    const [currentUserId, setCurrentUserId] = useState<string | number | null>(
        null
    )

    useEffect(() => {
        const tg = window.Telegram.WebApp as any

        // Foydalanuvchi ma'lumotlarini olish
        const user = tg.initDataUnsafe?.user
        if (user) {
            setCurrentUserId(user.id) // Foydalanuvchi ID sini saqlash
        }

        tg.ready()
    }, [])

    return (
        <div className="min-h-dvh px-5 py-10 flex flex-col items-center justify-center bg-blue-500">
            <h1 className="text-white mb-5">
                Foydalanuvchi ID: {currentUserId}
            </h1>
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
