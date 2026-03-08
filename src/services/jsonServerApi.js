import axios from 'axios'

const API_URL = 'http://localhost:5000'

// ── Searches ──────────────────────────────────────
export const saveSearch = async (searchData) => {
  const response = await axios.post(`${API_URL}/searches`, searchData)
  return response.data
}

export const getSearches = async () => {
  const response = await axios.get(`${API_URL}/searches`)
  return response.data
}

// ── Alerts ────────────────────────────────────────
export const saveAlert = async (alertData) => {
  const response = await axios.post(`${API_URL}/alerts`, alertData)
  return response.data
}

export const getAlerts = async () => {
  const response = await axios.get(`${API_URL}/alerts`)
  return response.data
}

export const deleteAlert = async (id) => {
  const response = await axios.delete(`${API_URL}/alerts/${id}`)
  return response.data
}
