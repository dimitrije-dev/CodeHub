import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function VelocityChart({ data, loading, onOpenTasks }) {
  if (loading) {
    return (
      <div className="card chart-card">
        <h3>Završeni taskovi</h3>
        <p>Učitavanje podataka...</p>
      </div>
    )
  }

  const formattedData = data?.map((item) => ({
    date: item.day,
    done: parseInt(item.done, 10) || 0,
  })) || []

  const hasMeaningfulData = formattedData.some((item) => item.done > 0)

  if (!formattedData.length || !hasMeaningfulData) {
    return (
      <div className="card chart-card chart-empty">
        <div>
          <h3>Završeni taskovi</h3>
          <p>Nema podataka za prikaz. Dodaj i završi prvi task da otključaš trend.</p>
        </div>
        <div className="inline-actions">
          <button className="btn btn-primary" onClick={onOpenTasks}>Otvori taskove</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card chart-card">
      <div>
        <h3>Završeni taskovi</h3>
        <p>Dnevni broj završenih taskova u poslednjih 7 dana.</p>
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
            formatter={(value) => [value, 'taskova']}
          />
          <Line
            type="monotone"
            dataKey="done"
            stroke="var(--chart-brand)"
            strokeWidth={3}
            dot={{ fill: 'var(--chart-brand)', strokeWidth: 1, r: 4 }}
            activeDot={{ r: 7, fill: 'var(--chart-brand)', stroke: 'var(--surface)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
