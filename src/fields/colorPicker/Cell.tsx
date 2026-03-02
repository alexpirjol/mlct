'use client'
import React from 'react'
import './styles.css'

interface CellProps {
  cellData?: unknown
}

const Cell: React.FC<CellProps> = ({ cellData }) => {
  if (!cellData) return null
  return <div className="ccp-cell" style={{ background: String(cellData) }} />
}

export default Cell
