import React from 'react'
import InfoPane from './InfoPane'

export default function GraphInfo({ totalDependencies, hasCircularDep, rootChildren }) {
  return (
    <div id="graph-info" data-testid="graph-info">
      <InfoPane
        title1="总依赖数"
        title2="循环依赖？"
        title3="依赖包列表"
        data1={totalDependencies.toString()}
        data2={hasCircularDep ? "有" : "无"}
        data3={rootChildren}
      />
    </div>
  )
}
