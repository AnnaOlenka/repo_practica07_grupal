# PRACTICA GRUPAL - DESARROLLO WEB - S7
## Integrantes
- Alarcón Mendoza Estiven Rodrigo
- Calderón Leiva Anna Olenka
- Cruz Cruz Alexander Jhon
- Martínez Casas Cristhian Emilio


# QA & Hook Validator

## 1) Introduccion tecnica del rol
El rol **QA & Hook Validator** en un proyecto React se enfoca en validar el uso correcto de Hooks, la coherencia del ciclo de vida del componente y la calidad del codigo. Su objetivo es prevenir efectos secundarios inesperados, renders innecesarios y errores sutiles que suelen aparecer cuando se incumplen las reglas de Hooks o se ignoran advertencias de ESLint. Este rol combina revision estatica (linting), verificacion de buenas practicas y analisis de rendimiento con herramientas como React DevTools Profiler.

## 2) Objetivo del aseguramiento de calidad en React
- Garantizar el cumplimiento de las reglas de Hooks.
- Reducir fallos en tiempo de ejecucion por dependencias incorrectas.
- Mantener consistencia en el ciclo de vida con `useEffect` y su cleanup.
- Prevenir renders innecesarios mediante memoizacion y callbacks estables.
- Asegurar un estilo de codigo mantenible, documentado y verificable.

## 3) Reglas de Hooks (explicacion detallada)
Las reglas de Hooks son estrictas porque React depende del orden de ejecucion de los Hooks para asignar estados correctamente.

1. **Solo llamar Hooks en el nivel superior**
   - No llamar Hooks dentro de condiciones, bucles o funciones anidadas.
   - Razon: React debe llamar Hooks en el mismo orden en cada render.

2. **Solo llamar Hooks en funciones React**
   - Componentes funcionales o custom hooks.
   - Razon: React solo administra su ciclo de vida en esos contextos.

## 4) Ejemplos correctos e incorrectos

### Correcto (del proyecto): Hooks al nivel superior
Ejemplo real en [src/components/AddTaskForm.jsx](src/components/AddTaskForm.jsx):
```jsx
import { useState, useRef, useEffect } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('frontend')
  const [priority, setPriority] = useState('media')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ...
}
```

### Correcto (del proyecto): memorizacion y callbacks estables
Ejemplo real en [src/components/TaskList.jsx](src/components/TaskList.jsx):
```jsx
const processedTasks = useMemo(() => {
  let result = [...items]
  // ... filtros y orden
  return result
}, [items, filter, sortBy, sortOrder])

const handleRemove = useCallback((id) => actions.removeTask(id), [actions])
```

### Incorrecto (anti-ejemplo basado en el proyecto)
Si se moviera un Hook dentro de `handleSubmit` en AddTaskForm, se rompe la regla:
```jsx
function AddTaskForm({ onAdd }) {
  const handleSubmit = (e) => {
    const [title, setTitle] = useState('')
    e.preventDefault()
    // ...
  }
}
```
Este patron no aparece en el proyecto y se evita por la regla `react-hooks/rules-of-hooks`.

## 5) ESLint y su importancia
ESLint analiza el codigo de forma estatica para detectar errores comunes, incumplimientos de estilo y malas practicas antes de ejecutar la aplicacion. En React, su valor principal es:
- Advertir sobre uso incorrecto de Hooks.
- Detectar dependencias faltantes en `useEffect`.
- Mantener un estandar de calidad uniforme en el equipo.

## 6) Reglas especificas: react-hooks/rules-of-hooks
Esta regla obliga a que:
- Los Hooks se llamen en el nivel superior.
- Los Hooks se llamen solo en componentes o custom hooks.

**Ejemplo de fallo:** usar un Hook dentro de un `if` o dentro de una funcion anidada.

## 7) Reglas especificas: react-hooks/exhaustive-deps
Valida la lista de dependencias en `useEffect`, `useMemo` y `useCallback`.
- Si se usa un valor en el efecto, debe estar en el array de dependencias.
- Evita closures obsoletas y sincroniza correctamente el estado.

**Ejemplo real (correcto) en [src/contexts/ThemeContext.jsx](src/contexts/ThemeContext.jsx):**
```jsx
useEffect(() => {
  document.body.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}, [theme])
```
**Anti-ejemplo (faltaria `theme` en dependencias):**
```jsx
useEffect(() => {
  document.body.setAttribute('data-theme', theme)
}, [])
```

## 8) Warnings comunes y como solucionarlos
- **Missing dependency**: agregar la variable al array de dependencias.
- **Hook used conditionally**: mover el Hook al nivel superior.
- **Stale closure**: usar dependencias correctas o `useRef`.
- **Excessive re-renders**: revisar estado derivado y memoizacion.

## 9) Custom Hook implementado (ejemplo tecnico)
El proyecto implementa `useTasksReducer` para encapsular reducer + acciones. Ejemplo real en [src/hooks/useTasksReducer.js](src/hooks/useTasksReducer.js):

```jsx
import { useReducer, useMemo } from 'react'

export function useTasksReducer() {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const actions = useMemo(() => buildActions(dispatch), [dispatch])
  return { state, dispatch, actions }
}
```

**Validacion QA:**
- Cumple reglas de Hooks.
- Dependencias declaradas correctamente (`useMemo`).
- API estable y documentada.

## 10) useEffect y cleanup
En el proyecto, el cleanup se usa para eliminar listeners del navegador. Ejemplo real en [src/contexts/ThemeContext.jsx](src/contexts/ThemeContext.jsx):

```jsx
useEffect(() => {
  const handleStorage = (e) => {
    if (e.key === 'theme' && e.newValue) {
      setTheme(e.newValue)
    }
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}, [])
```

## 11) React DevTools Profiler
El proyecto ya integra `Profiler` en el render de la lista de tareas, en [src/App.jsx](src/App.jsx):

```jsx
<Profiler
  id="TaskList"
  onRender={(id, phase, actualDuration) =>
    console.debug(`[Profiler:${id}] ${phase} took ${actualDuration.toFixed(1)}ms`)
  }
>
  <TaskList
    items={state.items}
    filter={state.filter}
    sortBy={state.sortBy}
    sortOrder={state.sortOrder}
    actions={actions}
  />
</Profiler>
```

Esto permite medir la duracion de renders de `TaskList` y validar optimizaciones.

## 12) Validacion de renders y rendimiento
Ejemplos reales aplicados:
- `useMemo` para el procesamiento de tareas en [src/components/TaskList.jsx](src/components/TaskList.jsx).
- `useCallback` para handlers estables en [src/components/TaskList.jsx](src/components/TaskList.jsx).
- `memo` para evitar renders innecesarios en `TaskItem` (mismo archivo).
- `useMemo` para estadisticas en [src/components/StatCards.jsx](src/components/StatCards.jsx).

## 13) Buenas practicas aplicadas
- Hooks al nivel superior.
- `useEffect` con dependencias completas.
- Cleanup en efectos con timers o listeners.
- Custom hooks para encapsular logica.
- Documentacion tecnica clara.

## 14) Justificacion del archivo ESLint
```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  plugins: ["react", "react-hooks"],

  rules: {
    // Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React 17+ JSX Transform
    "react/react-in-jsx-scope": "off",

    // Desactivar prop-types
    "react/prop-types": "off",
  },
};
```

**Justificacion tecnica por regla:**
- `root: true`: evita heredar configuraciones externas.
- `env.browser`: habilita globals del navegador.
- `env.es2021`: habilita sintaxis moderna.
- `eslint:recommended`: base de reglas esenciales.
- `plugin:react/recommended`: reglas especificas de React.
- `plugin:react-hooks/recommended`: activa reglas criticas de Hooks.
- `ecmaVersion: latest`: soporta caracteristicas recientes de JS.
- `sourceType: module`: habilita `import/export`.
- `jsx: true`: habilita JSX.
- `react.version: detect`: auto-deteccion de version de React.
- `react-hooks/rules-of-hooks: error`: rompe build si se violan reglas.
- `react-hooks/exhaustive-deps: warn`: avisa dependencias faltantes.
- `react/react-in-jsx-scope: off`: React 17+ no requiere `import React`.
- `react/prop-types: off`: se desactiva en proyectos sin PropTypes.

## 15) Conclusiones tecnicas del QA
El control estricto de Hooks y ESLint reduce errores de sincronizacion, asegura estabilidad del ciclo de vida y mejora el rendimiento. Un QA enfocado en Hooks garantiza que el codigo sea predecible, mantenible y medible.

## 16) Checklist final de validacion
- [ ] Hooks siempre al nivel superior.
- [ ] Hooks solo en componentes o custom hooks.
- [ ] Dependencias de `useEffect` completas.
- [ ] Cleanup en efectos con suscripciones o timers.
- [ ] Callbacks memoizados cuando se pasan a hijos.
- [ ] `useMemo` aplicado en calculos costosos.
- [ ] Sin warnings de ESLint en Hooks.
- [ ] Verificacion con React DevTools Profiler.
- [ ] Custom hooks documentados.
- [ ] Rendimiento validado en renders clave.