import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ActiveMessages from './pages/active-messages'
import Group from './pages/group'
import Main from './pages/main'
import Message from './pages/message'
import PermissionDenied from './pages/permission-denied'
import Photo from './pages/photo'
import { useUserId } from './user-context'

function App() {
  const { setUserId, userId } = useUserId()

  useEffect(() => {
    const tg = window.Telegram.WebApp as any

    // Foydalanuvchi ma'lumotlarini olish
    const user = tg.initDataUnsafe?.user
    if (user) {
      setUserId(user.id)
    }

    tg.ready()
  }, [setUserId])

  return (
    <div className="min-h-dvh px-5 bg-white py-10 flex flex-col items-center justify-center container mx-auto">
      {userId === null || userId === undefined || userId !== 858063187 ? (
        <PermissionDenied />
      ) : (
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/message" element={<Message />} />
          <Route path="/photo" element={<Photo />} />
          <Route path="/group" element={<Group />} />
          <Route path="/active" element={<ActiveMessages />} />
        </Routes>
      )}
      {/* <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/message" element={<Message />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/group" element={<Group />} />
        <Route path="/active" element={<ActiveMessages />} />
      </Routes> */}
    </div>
  )
}

export default App
