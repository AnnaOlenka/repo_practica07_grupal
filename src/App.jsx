import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { useTasksReducer } from './hooks/useTasksReducer'
import StatCards from './components/StatCards'
import FilterPanel from './components/FilterPanel'
import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTaskForm'
import { IconBolt, IconSun, IconMoon } from './components/Icons'

function Dashboard() {
  const { state, actions } = useTasksReducer()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`dashboard dashboard--${theme}`}>
      <header className="header">
        <div className="header-left">
          <span className="header-logo">
            <IconBolt size={22} />
          </span>
          <div>
            <h1 className="header-title">Dev Task Board</h1>
            <p className="header-subtitle">Dashboard de Gestión de Tareas</p>
          </div>
        </div>
        <button className="btn-theme" onClick={toggleTheme} title="Cambiar tema">
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      <main className="main-content">
        <StatCards items={state.items} />

        <section className="section">
          <h2 className="section-title">Nueva Tarea</h2>
          <AddTaskForm onAdd={actions.addTask} />
        </section>

        <section className="section">
          <h2 className="section-title">Filtros y Orden</h2>
          <FilterPanel
            filter={state.filter}
            sortBy={state.sortBy}
            sortOrder={state.sortOrder}
            actions={actions}
          />
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">
              Tareas
              <span className="task-count">{state.items.length}</span>
            </h2>
          </div>
          <TaskList
            items={state.items}
            filter={state.filter}
            sortBy={state.sortBy}
            sortOrder={state.sortOrder}
            actions={actions}
          />
        </section>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
