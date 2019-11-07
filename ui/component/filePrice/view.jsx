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
  // below props are just passed to <CreditAmount />
  badge?: boolean,
  inheritStyle?: boolean,
  showLBC?: boolean,
  hideFree?: boolean, // hide the file price if it's free
};

class FilePrice extends React.PureComponent<Props> {
  static defaultProps = {
    showFullPrice: false,
  };

  componentDidMount() {
    this.fetchCost(this.props);
  }

  componentDidUpdate() {
    this.fetchCost(this.props);
  }

  fetchCost = (props: Props) => {
    const { costInfo, fetchCostInfo, uri, fetching, claim } = props;

    if (costInfo === undefined && !fetching && claim) {
      fetchCostInfo(uri);
    }
  };

  render() {
    const { costInfo, showFullPrice, badge, inheritStyle, showLBC, hideFree } = this.props;

    if (costInfo && !costInfo.cost && hideFree) {
      return null;
    }

    return costInfo ? (
      <CreditAmount
        showFree
        badge={badge}
        inheritStyle={inheritStyle}
        showLBC={showLBC}
        amount={costInfo.cost}
        isEstimate={!costInfo.includesData}
        showFullPrice={showFullPrice}
      />
    ) : null;
  }
}

export default FilePrice;
