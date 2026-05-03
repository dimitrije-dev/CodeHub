import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ProgressChart({ data, loading, onStartFocus }) {
  if (loading) {
    return (
      <div className="card chart-card">
        <h3>Focus minutes</h3>
        <p>Loading data...</p>
      </div>
    )
  }

  const formattedData = data?.map((item) => ({
    date: item.day,
    total_minutes: parseInt(item.minutes, 10) || 0,
  })) || []

  const hasMeaningfulData = formattedData.some((item) => item.total_minutes > 0)

  if (!formattedData.length || !hasMeaningfulData) {
    return (
      <div className="card chart-card chart-empty">
        <div>
          <h3>Focus minutes</h3>
          <p>No focus sessions yet. Start your first pomodoro and begin building momentum.</p>
        </div>
        <div className="inline-actions">
          <button className="btn btn-primary" onClick={onStartFocus}>Start first focus session</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card chart-card">
      <div>
        <h3>Focus minutes</h3>
        <p>Total daily focus minutes across the last 7 days.</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData} margin={{ top: 8, right: 20, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid)" opacity={0.95} />
          <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--chart-axis)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: 'var(--chart-grid)', strokeWidth: 1.2 }}
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--chart-border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--text)',
            }}
            labelStyle={{
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginBottom: '6px',
            }}
            itemStyle={{
              color: 'var(--text)',
              fontWeight: 700,
            }}
            formatter={(value) => [value, 'minutes']}
          />
          <Line
            type="monotone"
            dataKey="total_minutes"
            stroke="var(--chart-success)"
            strokeWidth={3}
            dot={{ fill: 'var(--chart-success)', strokeWidth: 1, r: 4 }}
            activeDot={{ r: 7, fill: 'var(--chart-success)', stroke: 'var(--surface)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
