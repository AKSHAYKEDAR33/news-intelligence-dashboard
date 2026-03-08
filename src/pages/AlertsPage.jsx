import { useState, useEffect } from 'react'
import { saveAlert, getAlerts, deleteAlert } from '../services/jsonServerApi'
import AlertTable from '../components/AlertTable'

export default function AlertsPage() {
  const [name, setName]         = useState('')
  const [keywords, setKeywords] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [alerts, setAlerts]     = useState([])
  const [loading, setLoading]   = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState(null)

  // Load existing alerts from json-server on page load
  useEffect(() => {
    getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const newAlert = {
        name,
        keywords,
        frequency,
        createdAt: new Date().toISOString()
      }
      const saved = await saveAlert(newAlert)   // POST to json-server → db.json
      setAlerts((prev) => [...prev, saved])     // update table instantly
      setName('')
      setKeywords('')
      setFrequency('daily')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save alert: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id)                              // DELETE from json-server
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError('Failed to delete alert: ' + err.message)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Alerts</h1>
        <p>Create news alerts for topics you care about. All alerts are stored in db.json.</p>
        <div className="accent-line" />
      </div>

      {/* ── Alert Form ── */}
      <div className="form-card">
        <h2>Create New Alert</h2>

        <div className="form-row">
          <div className="form-group">
            <label>Alert Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tech Weekly"
              required
            />
          </div>
          <div className="form-group">
            <label>Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. AI, startups, funding"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 240 }}>
          <label>Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="instant">Instant</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !keywords.trim()}
        >
          {loading ? 'Saving...' : 'Create Alert'}
        </button>
      </div>

      {saved && <div className="success-toast">Alert saved to db.json</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="page-header" style={{ marginTop: '1rem' }}>
        <h1 style={{ fontSize: '1.4rem' }}>Existing Alerts</h1>
        <div className="accent-line" />
      </div>

      <AlertTable alerts={alerts} onDelete={handleDelete} />
    </div>
  )
}
