import React from 'react'
import {
  BusyMessage,
  CreditAmount,
} from 'component/common'

class FilePrice extends React.Component{
  componentWillMount() {
    this.fetchCost(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchCost(nextProps)
  }

  fetchCost(props) {
    const {
      costInfo,
      fetchCostInfo,
      uri,
      fetching,
    } = props

    if (costInfo === undefined && !fetching) {
      fetchCostInfo(uri)
    }
  }

  render() {
    const {
      costInfo,
      look = 'indicator',
    } = this.props

    const isEstimate = costInfo ? !costInfo.includesData : null

    if (!costInfo) {
      return <BusyMessage className={`credit-amount credit-amount--${look}`} message="Looking up price" />
    }

    return <CreditAmount label={false} amount={costInfo.cost} isEstimate={isEstimate} showFree={true} />
  }
}

export default FilePrice
