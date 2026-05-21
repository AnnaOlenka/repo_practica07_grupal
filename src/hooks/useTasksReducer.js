import { useReducer, useMemo } from 'react'

// ─── Action Types ────────────────────────────────────────────────────────────
export const ACTIONS = {
  ADD_TASK:        'ADD_TASK',
  REMOVE_TASK:     'REMOVE_TASK',
  MOVE_STATUS:     'MOVE_STATUS',
  UPDATE_PRIORITY: 'UPDATE_PRIORITY',
  SET_FILTER:      'SET_FILTER',
  SET_SORT_BY:     'SET_SORT_BY',
  SET_SORT_ORDER:  'SET_SORT_ORDER',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
}

// ─── Initial State ───────────────────────────────────────────────────────────
export const initialState = {
  items: [
    {
      id: 1,
      title: 'Configurar ESLint y Prettier',
      category: 'devops',
      priority: 'alta',
      status: 'hecho',
      createdAt: '2026-05-18T10:00:00Z',
    },
    {
      id: 2,
      title: 'Implementar autenticación JWT',
      category: 'backend',
      priority: 'alta',
      status: 'en-progreso',
      createdAt: '2026-05-19T09:00:00Z',
    },
    {
      id: 3,
      title: 'Diseñar componentes del dashboard',
      category: 'frontend',
      priority: 'media',
      status: 'en-progreso',
      createdAt: '2026-05-19T11:00:00Z',
    },
    {
      id: 4,
      title: 'Crear wireframes de onboarding',
      category: 'diseño',
      priority: 'baja',
      status: 'pendiente',
      createdAt: '2026-05-20T08:30:00Z',
    },
    {
      id: 5,
      title: 'Optimizar queries de base de datos',
      category: 'backend',
      priority: 'media',
      status: 'pendiente',
      createdAt: '2026-05-20T14:00:00Z',
    },
    {
      id: 6,
      title: 'Revisar accesibilidad (WCAG 2.1)',
      category: 'frontend',
      priority: 'baja',
      status: 'pendiente',
      createdAt: '2026-05-21T07:00:00Z',
    },
  ],
  filter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

// ─── Reducer (puro e inmutable) ───────────────────────────────────────────────
function tasksReducer(state, action) {
  switch (action.type) {

    case ACTIONS.ADD_TASK:
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now(),
            title: action.payload.title,
            category: action.payload.category,
            priority: action.payload.priority,
            status: 'pendiente',
            createdAt: new Date().toISOString(),
          },
        ],
      }

    case ACTIONS.REMOVE_TASK:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }

    case ACTIONS.MOVE_STATUS:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item
        ),
      }

    case ACTIONS.UPDATE_PRIORITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, priority: action.payload.priority }
            : item
        ),
      }

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter,
      }

    case ACTIONS.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload.sortBy,
      }

    case ACTIONS.SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload.sortOrder,
      }

    case ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        items: state.items.filter((item) => item.status !== 'hecho'),
      }

    default:
      return state
  }
}

// ─── Action Creators ──────────────────────────────────────────────────────────
function buildActions(dispatch) {
  return {
    addTask: (title, category, priority) =>
      dispatch({ type: ACTIONS.ADD_TASK, payload: { title, category, priority } }),

    removeTask: (id) =>
      dispatch({ type: ACTIONS.REMOVE_TASK, payload: { id } }),

    moveStatus: (id, status) =>
      dispatch({ type: ACTIONS.MOVE_STATUS, payload: { id, status } }),

    updatePriority: (id, priority) =>
      dispatch({ type: ACTIONS.UPDATE_PRIORITY, payload: { id, priority } }),

    setFilter: (filter) =>
      dispatch({ type: ACTIONS.SET_FILTER, payload: { filter } }),

    setSortBy: (sortBy) =>
      dispatch({ type: ACTIONS.SET_SORT_BY, payload: { sortBy } }),

    setSortOrder: (sortOrder) =>
      dispatch({ type: ACTIONS.SET_SORT_ORDER, payload: { sortOrder } }),

    clearCompleted: () =>
      dispatch({ type: ACTIONS.CLEAR_COMPLETED }),
  }
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export function useTasksReducer() {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const actions = useMemo(() => buildActions(dispatch), [dispatch])
  return { state, dispatch, actions }
}
