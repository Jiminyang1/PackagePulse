import React, { useState } from 'react'
import './App.css'
import Graph from './components/Graph'
import Inspector from './components/Inspector'
import InsepctorControl from './components/InspectorControl'

function App() {
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [totalDependencies, setTotalDependencies] = useState(0)
  const [hasCircularDep, setCircularDep] = useState(false)
  const [rootChildren, setRootChildren] = useState([])

  return (
    <div id="App">
      <Graph
        setTotalDependencies={setTotalDependencies}
        setCircularDep={setCircularDep}
        setRootChildren={setRootChildren}
      />
      <InsepctorControl
        isOpen={inspectorOpen}
        onClick={() => setInspectorOpen(!inspectorOpen)}
      />
      <Inspector
        className={inspectorOpen ? 'open' : ''}
        totalDependencies={totalDependencies}
        hasCircularDep={hasCircularDep}
        rootChildren={rootChildren}
      />
    </div>
  )
}

export default App
