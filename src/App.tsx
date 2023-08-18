import React, { useState } from 'react'
import './App.css'
import Graph from './components/Graph'
import Inspector from './components/Inspector'
import InsepctorControl from './components/InspectorControl'

function App() {
  const [inspectorOpen, setInspectorOpen] = useState(false)

  return (
    <div id="App">
      <Graph />
      <InsepctorControl
        isOpen={inspectorOpen}
        onClick={() => setInspectorOpen(!inspectorOpen)}
      />
      <Inspector className={inspectorOpen ? 'open' : ''} />
    </div>
  )
}

export default App
