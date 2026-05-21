import { useCallback } from 'react'
import { IconArrowUp, IconArrowDown } from './Icons'

const PRIORITY_DOT = {
  alta:  'var(--accent-red)',
  media: 'var(--accent-yellow)',
  baja:  'var(--accent-green)',
}

const FILTERS = [
  { value: 'all',         label: 'Todas',       dot: null },
  { value: 'pendiente',   label: 'Pendiente',   dot: null },
  { value: 'en-progreso', label: 'En Progreso', dot: null },
  { value: 'hecho',       label: 'Hecho',       dot: null },
  { value: 'alta',        label: 'Alta',        dot: PRIORITY_DOT.alta },
  { value: 'media',       label: 'Media',       dot: PRIORITY_DOT.media },
  { value: 'baja',        label: 'Baja',        dot: PRIORITY_DOT.baja },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Fecha' },
  { value: 'priority',  label: 'Prioridad' },
  { value: 'title',     label: 'Título' },
]

export default function FilterPanel({ filter, sortBy, sortOrder, actions }) {
  const handleFilter = useCallback((value) => actions.setFilter(value), [actions])
  const handleSortBy = useCallback((value) => actions.setSortBy(value), [actions])
  const toggleOrder = useCallback(
    () => actions.setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'),
    [actions, sortOrder]
  )
  const clearCompleted = useCallback(() => actions.clearCompleted(), [actions])

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <span className="filter-label">Filtrar</span>
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`chip ${filter === f.value ? 'chip--active' : ''}`}
              onClick={() => handleFilter(f.value)}
            >
              {f.dot && (
                <span
                  className="chip-dot"
                  style={{ background: f.dot }}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Ordenar por</span>
        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => handleSortBy(e.target.value)}
            className="select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            className="btn-icon"
            onClick={toggleOrder}
            title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
          >
            {sortOrder === 'asc' ? <IconArrowUp /> : <IconArrowDown />}
          </button>
        </div>
      </div>

      <button className="btn-danger" onClick={clearCompleted}>
        Limpiar completadas
      </button>
    </div>
  )
}
