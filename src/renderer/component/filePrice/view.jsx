// @flow
import React from 'react';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  showFullPrice: boolean,
  costInfo: ?{ includesData: boolean, cost: number },
  fetchCostInfo: string => void,
  uri: string,
  fetching: boolean,
  claim: ?{},
};

class FilePrice extends React.PureComponent<Props> {
  static defaultProps = {
    showFullPrice: false,
  };

  render() {
    const { claim, costInfo, fetchCostInfo, fetching, showFullPrice, uri } = this.props;

    if (costInfo === undefined && !fetching && claim) {
      fetchCostInfo(uri);
    }

    const isEstimate = costInfo ? !costInfo.includesData : false;

    if (!costInfo) {
      return null;
    }

    return (
      <CreditAmount
        amount={costInfo.cost}
        isEstimate={isEstimate}
        showFree
        showFullPrice={showFullPrice}
      />
    );
  }
}

export default FilePrice;
