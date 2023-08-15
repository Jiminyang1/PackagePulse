import React from 'react'
import './styles/InspectorControl.css'
import PropTypes from 'prop-types'

export default function InsepctorControl({ onClick, isOpen }) {
  return (
    <div id="control" onClick={onClick}>
      {isOpen ? '\u{25b6}' : '\u{25c0}'}
    </div>
  )
}

InsepctorControl.propTypes = {
  onClick: PropTypes.func,
  isOpen: PropTypes.bool
}
