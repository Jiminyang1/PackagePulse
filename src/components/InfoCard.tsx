import React from 'react'
import './styles/InfoCard.css'
import PropTypes from 'prop-types'

export default function InfoCard({ title, data, ...props }) {
  return (
    <div className="info-card">
      <div id="info-card-title">{title}</div>
      <br></br>
      <div id="info-card-data">{data}</div>
    </div>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.string
}
