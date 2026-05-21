import { IconList, IconGear, IconCheck, IconAlert } from './Icons'

const STATS = [
  {
    key: 'total',
    label: 'Total',
    Icon: IconList,
    color: 'var(--accent-blue)',
    getValue: (items) => items.length,
  },
  {
    key: 'en-progreso',
    label: 'En Progreso',
    Icon: IconGear,
    color: 'var(--accent-yellow)',
    getValue: (items) => items.filter((i) => i.status === 'en-progreso').length,
  },
  {
    key: 'hecho',
    label: 'Completadas',
    Icon: IconCheck,
    color: 'var(--accent-green)',
    getValue: (items) => items.filter((i) => i.status === 'hecho').length,
  },
  {
    key: 'alta',
    label: 'Alta Prioridad',
    Icon: IconAlert,
    color: 'var(--accent-red)',
    getValue: (items) => items.filter((i) => i.priority === 'alta').length,
  },
]

export default function StatCards({ items }) {
  return (
    <div className="stat-cards">
      {STATS.map((stat) => (
        <div key={stat.key} className="stat-card" style={{ '--card-accent': stat.color }}>
          <span className="stat-icon" style={{ color: stat.color }}>
            <stat.Icon size={24} />
          </span>
          <div className="stat-info">
            <span className="stat-value">{stat.getValue(items)}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
