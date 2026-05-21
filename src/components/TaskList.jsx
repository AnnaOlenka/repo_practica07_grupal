import { useMemo, useCallback, memo } from 'react'
import { IconCircle, IconLoader, IconCheckCircle, IconX } from './Icons'

const PRIORITY_ORDER = { alta: 0, media: 1, baja: 2 }
const STATUS_CYCLE    = { pendiente: 'en-progreso', 'en-progreso': 'hecho', hecho: 'pendiente' }

const PRIORITY_COLOR = {
  alta:  'var(--accent-red)',
  media: 'var(--accent-yellow)',
  baja:  'var(--accent-green)',
}

const CATEGORY_COLOR = {
  frontend: 'var(--accent-blue)',
  backend:  'var(--accent-green)',
  devops:   'var(--accent-yellow)',
  diseño:   'var(--accent-purple)',
}

const StatusIcon = ({ status }) => {
  if (status === 'hecho')       return <IconCheckCircle size={17} />
  if (status === 'en-progreso') return <IconLoader size={17} />
  return <IconCircle size={17} />
}

function TaskItem({ task, onRemove, onMoveStatus, onUpdatePriority }) {
  return (
    <li className={`task-item task-item--${task.status}`}
        style={{ borderLeftColor: PRIORITY_COLOR[task.priority] }}>
      <div className="task-left">
        <button
          className={`status-btn status-btn--${task.status}`}
          onClick={() => onMoveStatus(task.id, STATUS_CYCLE[task.status])}
          title={`Pasar a: ${STATUS_CYCLE[task.status]}`}
        >
          <StatusIcon status={task.status} />
        </button>
        <div className="task-info">
          <span className={`task-title ${task.status === 'hecho' ? 'task-title--done' : ''}`}>
            {task.title}
          </span>
          <span className="task-category" style={{ color: CATEGORY_COLOR[task.category] }}>
            {task.category}
          </span>
        </div>
      </div>
      <div className="task-right">
        <select
          className="select select--small priority-select"
          value={task.priority}
          style={{ borderColor: PRIORITY_COLOR[task.priority] }}
          onChange={(e) => onUpdatePriority(task.id, e.target.value)}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button className="btn-remove" onClick={() => onRemove(task.id)} title="Eliminar">
          <IconX size={13} />
        </button>
      </div>
    </li>
  )
}

const MemoizedTaskItem = memo(TaskItem)

export default function TaskList({ items, filter, sortBy, sortOrder, actions }) {
  const processedTasks = useMemo(() => {
    let result = [...items]

    if (filter !== 'all') {
      const isStatus = ['pendiente', 'en-progreso', 'hecho'].includes(filter)
      result = isStatus
        ? result.filter((t) => t.status === filter)
        : result.filter((t) => t.priority === filter)
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'priority') {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      } else if (sortBy === 'title') {
        cmp = a.title.localeCompare(b.title)
      } else {
        cmp = new Date(a.createdAt) - new Date(b.createdAt)
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

    return result
  }, [items, filter, sortBy, sortOrder])

  const handleRemove        = useCallback((id) => actions.removeTask(id), [actions])
  const handleMoveStatus    = useCallback((id, status) => actions.moveStatus(id, status), [actions])
  const handleUpdatePriority = useCallback((id, priority) => actions.updatePriority(id, priority), [actions])

  if (processedTasks.length === 0) {
    return <div className="empty-state">Sin tareas para mostrar</div>
  }

  return (
    <ul className="task-list">
      {processedTasks.map((task) => (
        <MemoizedTaskItem
          key={task.id}
          task={task}
          onRemove={handleRemove}
          onMoveStatus={handleMoveStatus}
          onUpdatePriority={handleUpdatePriority}
        />
      ))}
    </ul>
  )
}
