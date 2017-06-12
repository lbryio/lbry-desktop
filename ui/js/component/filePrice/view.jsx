import React from "react";
import { CreditAmount } from "component/common";

class FilePrice extends React.PureComponent {
  componentWillMount() {
    this.fetchCost(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchCost(nextProps);
  }

  fetchCost(props) {
    const { costInfo, fetchCostInfo, uri, fetching, claim } = props;

    if (costInfo === undefined && !fetching && claim) {
      fetchCostInfo(uri);
    }
  }

  render() {
    const { costInfo, look = "indicator" } = this.props;

    const isEstimate = costInfo ? !costInfo.includesData : null;

    if (!costInfo) {
      return (
        <span className={`credit-amount credit-amount--${look}`}>???</span>
      );
    }

    return (
      <CreditAmount
        label={false}
        amount={costInfo.cost}
        isEstimate={isEstimate}
        showFree={true}
      />
    );
  }
}

export default FilePrice;
