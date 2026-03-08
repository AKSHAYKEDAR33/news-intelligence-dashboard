export default function AlertTable({ alerts, onDelete }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="state-msg">
          <p>No alerts created yet. Use the form above to add one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-wrapper fade-in">
      <table>
        <thead>
          <tr>
            <th>Alert Name</th>
            <th>Keywords</th>
            <th>Frequency</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td style={{ fontWeight: 500 }}>{alert.name}</td>
              <td style={{ color: 'var(--text-muted)' }}>{alert.keywords}</td>
              <td>
                <span className={`badge ${alert.frequency}`}>{alert.frequency}</span>
              </td>
              <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {new Date(alert.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </td>
              <td>
                <button className="btn-delete" onClick={() => onDelete(alert.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
