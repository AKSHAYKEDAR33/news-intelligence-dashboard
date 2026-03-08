import { useState } from 'react'
import { useSearchNews } from '../hooks/useNewsApi'
import { saveSearch } from '../services/jsonServerApi'
import NewsTable from '../components/NewsTable'

const CATEGORIES = ['', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']

export default function SearchPage() {
  const [keyword, setKeyword]     = useState('')
  const [category, setCategory]   = useState('')
  const [saved, setSaved]         = useState(false)
  const { articles, loading, error, search } = useSearchNews()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    // 1. Fetch news from NewsAPI
    await search(keyword, category)

    // 2. Save the search query to json-server → db.json
    await saveSearch({
      keyword,
      category: category || 'any',
      timestamp: new Date().toISOString()
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Search News</h1>
        <p>Find articles by keyword and category. Every search is saved automatically.</p>
        <div className="accent-line" />
      </div>

      {/* ── Search Form ── */}
      <div className="form-card">
        <h2>New Search</h2>

        <div className="form-row">
          <div className="form-group">
            <label>Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. artificial intelligence"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c ? c.charAt(0).toUpperCase() + c.slice(1) : 'Any'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !keyword.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {saved && <div className="success-toast">Search saved to db.json</div>}
      {error  && <div className="error-msg">{error.message}</div>}

      {articles.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
            Results for "{keyword}"
          </h2>
          <NewsTable articles={articles} />
        </>
      )}
    </div>
  )
}
