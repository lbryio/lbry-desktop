// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';

type Props = {
  showFullPrice: boolean,
  costInfo: ?{ includesData: boolean, cost: number },
  doFetchCostInfoForUri: (string) => void,
  uri: string,
  fetching: boolean,
  claim: ?{},
  claimWasPurchased: boolean,
  claimIsMine: boolean,
  type?: string,
  // below props are just passed to <CreditAmount />
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
    const { costInfo, doFetchCostInfoForUri, uri, fetching, claim } = props;

    if (costInfo === undefined && !fetching && claim) {
      doFetchCostInfoForUri(uri);
    }
  };

  render() {
    const { costInfo, showFullPrice, showLBC, hideFree, claimWasPurchased, type, claimIsMine } = this.props;

    if (claimIsMine || !costInfo || !costInfo.cost || (!costInfo.cost && hideFree)) {
      return null;
    }

    return claimWasPurchased ? (
      <span
        className={classnames('file-price__key', {
          'file-price__key--filepage': type === 'filepage',
          'file-price__key--modal': type === 'modal',
        })}
      >
        <Icon icon={ICONS.PURCHASED} size={type === 'filepage' ? 22 : undefined} />
      </span>
    ) : (
      <CreditAmount
        className={classnames('file-price', {
          'file-price--filepage': type === 'filepage',
          'file-price--modal': type === 'modal',
        })}
        showFree
        showLBC={showLBC}
        amount={costInfo.cost}
        isEstimate={!costInfo.includesData}
        showFullPrice={showFullPrice}
      />
    );
  }
}

export default FilePrice;
