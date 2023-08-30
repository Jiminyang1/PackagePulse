import React from 'react'
import './styles/InfoPane.css'
import InfoCard from './InfoCard'
import PropTypes from 'prop-types'

export default function InfoPane({ title1, title2, title3, data1, data2, data3 }) {
  return (
    <div id="info-pane">
      <div id="info-pane-cards">
        <InfoCard title={title1} data={data1} />
        <hr id="info-pane-hr" />
        <InfoCard title={title2} data={data2} />
      </div>
      <div id="info-pane-description">
        <h3>{title3}</h3>
        <div>
          {data3.map((childName) => {
            return <li key={childName}>
              {childName}
            </li>
          })}
        </div>
      </div>
    </div>
  )
}

InfoPane.propTypes = {
  title1: PropTypes.string,
  title2: PropTypes.string,
  title3: PropTypes.string,
  data1: PropTypes.node,
  data2: PropTypes.node
}
