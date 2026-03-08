import axios from 'axios'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

export const getTopHeadlines = async (country = 'us') => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: { country, apiKey: API_KEY }
  })
  return response.data.articles
}

export const searchNews = async (keyword, category = '') => {
  const response = await axios.get(`${BASE_URL}/top-headlines`, {
    params: {
      q: keyword,
      category: category || undefined,
      country: 'us',       // required to avoid NewsAPI error
      apiKey: API_KEY
    }
  })
  return response.data.articles
}
