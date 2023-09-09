import React from 'react'
import InfoPane from './InfoPane'

export default function PackageInfo() {
  return (
    <div id="package-info" data-testid={"package-info"}>
      <InfoPane
        title1="Current Depth"
        title2="Sub-dependencies"
        title3="Dependency List"
        data1="2"
        data2="10"
        data3={[]}
      />
    </div>
  )
}
