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

  componentWillMount() {
    this.fetchCost(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchCost(nextProps);
  }

  fetchCost = (props: Props) => {
    const { costInfo, fetchCostInfo, uri, fetching, claim } = props;

    if (costInfo === undefined && !fetching && claim) {
      fetchCostInfo(uri);
    }
  };

  render() {
    const { costInfo, showFullPrice } = this.props;

    const isEstimate = costInfo ? !costInfo.includesData : false;

    if (!costInfo) {
      return <span className="credit-amount">PRICE</span>;
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
