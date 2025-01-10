import { api } from '../axios'
import { useUserId } from '../user-context'

const useAxiosApi = () => {
  const { userId } = useUserId()

  api.interceptors.request.use((config) => {
    if (userId) {
      config.headers['admin'] = userId
    }
    return config
  })

  return api
}

export default useAxiosApi
