import React from 'react'
import {
  CreditAmount,
} from 'component/common'

const FilePrice = (props) => {
  const {
    costInfo,
    look = 'indicator',
  } = props

  const isEstimate = costInfo ? !costInfo.includesData : null

  if (!costInfo) {
    return <span className={`credit-amount credit-amount--${look}`}>???</span>;
  }

  return <CreditAmount label={false} amount={costInfo.cost} isEstimate={isEstimate} showFree={true} />
}

export default FilePrice
