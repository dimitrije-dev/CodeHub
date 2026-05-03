import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ProgressChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card chart-card">
        <h3>Fokus minuti</h3>
        <p>Učitavanje podataka...</p>
      </div>
    )
  }

  const formattedData = data?.map((item) => ({
    date: item.day,
    total_minutes: parseInt(item.minutes, 10) || 0,
  })) || []

  return (
    <div className="card chart-card">
      <div>
        <h3>Fokus minuti</h3>
        <p>Ukupni minuti fokusa po danima, poslednjih 7 dana.</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData} margin={{ top: 8, right: 20, left: 4, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.55} />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
            formatter={(value) => [value, 'minuta']}
          />
          <Line
            type="monotone"
            dataKey="total_minutes"
            stroke="var(--success)"
            strokeWidth={3}
            dot={{ fill: 'var(--success)', strokeWidth: 1, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
