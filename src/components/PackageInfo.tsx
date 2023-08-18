import React from 'react'
import InfoPane from './InfoPane'

export default function PackageInfo() {
  return (
    <div id="package-info">
      <InfoPane
        title1="深度"
        title2="依赖数"
        title3="包信息"
        data1={2}
        data2={10}
      />
    </div>
  )
}
