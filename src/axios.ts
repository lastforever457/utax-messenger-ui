import axios from 'axios'

const token = '7917403316:AAGvI4WMUMQB3CzASZX0z6kd9TVyhn4HlaY'

const BASE_URL = 'https://utax-messenger-backend.onrender.com'
const API_URL = `https://api.telegram.org/bot${token}`

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const telegramApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
