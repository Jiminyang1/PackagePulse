import React from 'react'
import InfoPane from './InfoPane'

export default function GraphInfo({ totalDependencies, hasCircularDep, rootChildren }) {
  return (
    <div id="graph-info" data-testid="graph-info">
      <InfoPane
        title1="Total Dep."
        title2="Circular Dep.？"
        title3="List of Root Dependencies"
        data1={totalDependencies.toString()}
        data2={hasCircularDep ? "Yes" : "No"}
        data3={rootChildren}
      />
    </div>
  )
}
