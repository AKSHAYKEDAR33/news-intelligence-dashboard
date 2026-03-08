import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-shell">
        <section className="landing-hero">
          <p className="landing-kicker">NewsIntel Platform</p>
          <h1>Track the news cycle with clarity and focus.</h1>
          <p className="landing-copy">
            Start from one clean workspace to monitor top headlines, filter stories by your interests, and
            organize alerts that matter to you.
          </p>

          <div className="landing-actions">
            <Link to="/auth" className="btn btn-primary">
              Get Started
            </Link>
            <a href="#features" className="btn btn-outline">
              Explore Features
            </a>
          </div>
        </section>

        <section className="landing-spotlight">
          <p className="spotlight-label">What you get</p>
          <ul className="spotlight-list">
            <li>Live US headlines with visual previews.</li>
            <li>Personal interest filters to reduce noise.</li>
            <li>Search history and alert management in one place.</li>
          </ul>
        </section>
      </div>

      <section id="features" className="landing-features">
        <article className="feature-card">
          <h3>Focused Dashboard</h3>
          <p>Scan the latest stories in a spacious card layout built for fast reading.</p>
        </article>
        <article className="feature-card">
          <h3>Smart Filtering</h3>
          <p>Filter by keywords and source instantly to match your interests and workflow.</p>
        </article>
        <article className="feature-card">
          <h3>Organized Alerts</h3>
          <p>Create recurring alert rules and keep track of topics you care about most.</p>
        </article>
      </section>

    </section>
  )
}
