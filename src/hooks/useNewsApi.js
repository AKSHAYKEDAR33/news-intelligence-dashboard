import { useState, useEffect } from 'react'
import { getTopHeadlines, searchNews } from '../services/newsApi'

// Hook: load top headlines on mount
export function useTopHeadlines() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getTopHeadlines()
      .then(setArticles)
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { articles, loading, error }
}

// Hook: search news on demand
export function useSearchNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const search = async (keyword, category) => {
    setLoading(true)
    setError(null)
    try {
      const results = await searchNews(keyword, category)
      setArticles(results)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { articles, loading, error, search }
}
