export default function NewsTable({ articles }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="state-msg">
          <p>No articles found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrapper fade-in">
      <div className="news-grid">
        {articles.map((article) => {
          const imageUrl = article.urlToImage && article.urlToImage.startsWith('http')
            ? article.urlToImage
            : ''

          return (
            <article key={article.url || article.title} className="news-card">
              <div className="news-media">
                {imageUrl ? (
                  <img src={imageUrl} alt={article.title || 'News'} className="news-thumb" loading="lazy" />
                ) : (
                  <div className="news-thumb news-thumb-fallback">No image available</div>
                )}
              </div>

              <div className="news-content">
                <p className="news-meta">
                  <span>{article.source?.name || 'Unknown source'}</span>
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })
                      : 'Date unavailable'}
                  </span>
                </p>

                <h3>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title || 'Untitled article'}
                  </a>
                </h3>

                <p className="news-description">
                  {article.description || 'No description available for this article.'}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
