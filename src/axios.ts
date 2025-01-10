import axios from 'axios'

// const token = '7605634228:AAECY3fDGlaqfn_cotZyUxSh0f-ons9XKGk' //utax test
const token = '7363986636:AAGyNRYY0sTjewZ3WqB06fGXSorQEzuBEM4' //utax test 2
// const token = `7917403316:AAGvI4WMUMQB3CzASZX0z6kd9TVyhn4HlaY` //utax messanger

// const BASE_URL = 'http://localhost:3000'
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
