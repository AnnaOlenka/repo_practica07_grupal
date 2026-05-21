import { useState, useRef } from 'react'

const CATEGORIES = ['frontend', 'backend', 'devops', 'diseño']
const PRIORITIES = ['alta', 'media', 'baja']

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('frontend')
  const [priority, setPriority] = useState('media')
  // TODO (Optimizador): useRef para auto-focus al abrir el formulario
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed, category, priority)
    setTitle('')
    inputRef.current?.focus()
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="input"
        type="text"
        placeholder="Nueva tarea..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button className="btn-primary" type="submit">
        + Agregar
      </button>
    </form>
  )
}
