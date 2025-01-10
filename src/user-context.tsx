import { createContext, useContext, useState } from 'react'

export const UserContext = createContext<{
  userId: number | string | null
  setUserId: (userId: number | null) => void
}>({
  userId: null,
  setUserId: () => {},
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | string | null>(null)

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserId = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserId must be used within a UserProvider')
  }
  return context
}
