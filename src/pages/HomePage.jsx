import { useEffect, useMemo, useState } from 'react'
import { useTopHeadlines } from '../hooks/useNewsApi'
import NewsTable from '../components/NewsTable'

const ITEMS_PER_PAGE = 10

export default function HomePage() {
  const { articles, loading, error } = useTopHeadlines()
  const [interest, setInterest] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredArticles = useMemo(() => {
    const normalizedInterest = interest
      .toLowerCase()
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const normalizedSource = sourceFilter.trim().toLowerCase()

    return articles.filter((article) => {
      const searchableText = [article.title, article.description, article.content]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const sourceName = (article.source?.name || '').toLowerCase()

      const matchesInterest =
        normalizedInterest.length === 0 ||
        normalizedInterest.some((keyword) => searchableText.includes(keyword))

      const matchesSource =
        !normalizedSource || sourceName.includes(normalizedSource)

      return matchesInterest && matchesSource
    })
  }, [articles, interest, sourceFilter])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [interest, sourceFilter])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredArticles, currentPage])

  return (
    <div>
      <div className="page-header">
        <h1>Top Headlines</h1>
        <p>Latest news from the United States with visual previews and quick filtering.</p>
        <div className="accent-line" />
      </div>

      {!loading && !error && (
        <div className="stats-bar">
          <div className="stat-chip">
            <strong>{articles.length}</strong> loaded
          </div>
          <div className="stat-chip">
            <strong>{filteredArticles.length}</strong> matching
          </div>
          <div className="stat-chip">
            <strong>{ITEMS_PER_PAGE}</strong> per page
          </div>
          <div className="stat-chip">
            Updated at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="form-card">
          <h2>Filter by Your Interest</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Interest Keywords</label>
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="ai, startups, geopolitics"
              />
            </div>
            <div className="form-group">
              <label>Source Name</label>
              <input
                type="text"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                placeholder="BBC, Reuters, The Verge"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                setInterest('')
                setSourceFilter('')
              }}
              disabled={!interest.trim() && !sourceFilter.trim()}
            >
              Reset Filters
            </button>
            <p className="filter-helper">Use comma-separated keywords to match titles and descriptions.</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="state-msg">
          <p>Loading headlines...</p>
        </div>
      )}

      {error && (
        <div className="error-msg">
          Could not load headlines: {error.message}. Check your API key in the .env file.
        </div>
      )}

      {!loading && !error && (
        <>
          <NewsTable articles={paginatedArticles} />

          {filteredArticles.length > ITEMS_PER_PAGE && (
            <div className="pagination-bar">
              <p className="pagination-text">
                Page {currentPage} of {totalPages}
              </p>
              <div className="pagination-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
