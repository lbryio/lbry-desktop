import React from 'react'
import {
  CreditAmount,
} from 'component/common'

class FilePrice extends React.Component{
  componentDidMount() {
    this.fetchCost(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchCost(nextProps)
  }

  fetchCost(props) {
    const {
      costInfo,
      fetchCostInfo,
      uri
    } = props

    if (costInfo === undefined) {
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
      return <span className={`credit-amount credit-amount--${look}`}>???</span>;
    }

    return <CreditAmount label={false} amount={costInfo.cost} isEstimate={isEstimate} showFree={true} />
  }
}

export default FilePrice
