import React from 'react'
import InfoPane from './InfoPane'

export default function GraphInfo() {
  return (
    <div id="graph-info">
      <InfoPane
        title1="总依赖数"
        title2="循环依赖？"
        title3="依赖包列表"
        data1="123"
        data2={'有'}
      />
    </div>
  )
}
