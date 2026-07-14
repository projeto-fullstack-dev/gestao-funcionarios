import api from '../lib/api'

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  return data
}
