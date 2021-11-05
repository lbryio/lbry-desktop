// @flow
import 'scss/component/_file-price.scss';
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  claim: ?{},
  claimIsMine: boolean,
  claimWasPurchased: boolean,
  costInfo?: ?{ includesData: boolean, cost: number },
  fetching: boolean,
  showFullPrice: boolean,
  type?: string,
  uri: string,
  // below props are just passed to <CreditAmount />
  customPrices?: { priceFiat: number, priceLBC: number },
  hideFree?: boolean, // hide the file price if it's free
  isFiat?: boolean,
  showLBC?: boolean,
  doFetchCostInfoForUri: (string) => void,
};

class FilePrice extends React.PureComponent<Props> {
  static defaultProps = { showFullPrice: false };

  componentDidMount() {
    this.fetchCost(this.props);
  }

  componentDidUpdate() {
    this.fetchCost(this.props);
  }

  fetchCost = (props: Props) => {
    const { costInfo, uri, fetching, claim, doFetchCostInfoForUri } = props;

    if (uri && costInfo === undefined && !fetching && claim) doFetchCostInfoForUri(uri);
  };

  render() {
    const {
      costInfo,
      showFullPrice,
      showLBC,
      isFiat,
      hideFree,
      claimWasPurchased,
      type,
      claimIsMine,
      customPrices,
    } = this.props;

    if (!customPrices && (claimIsMine || !costInfo || !costInfo.cost || (!costInfo.cost && hideFree))) return null;

    const className = classnames(claimWasPurchased ? 'filePrice__key' : 'filePrice', {
      'filePrice--filepage': type === 'filepage',
      'filePrice--modal': type === 'modal',
    });

    return claimWasPurchased ? (
      <span className={className}>
        <Icon icon={ICONS.PURCHASED} size={type === 'filepage' ? 22 : undefined} />
      </span>
    ) : (
      <CreditAmount
        amount={costInfo ? costInfo.cost : undefined}
        customAmounts={
          customPrices ? { amountFiat: customPrices.priceFiat, amountLBC: customPrices.priceLBC } : undefined
        }
        className={className}
        isEstimate={!!costInfo && !costInfo.includesData}
        isFiat={isFiat}
        showFree
        showFullPrice={showFullPrice}
        showLBC={showLBC}
      />
    );
  }
}

export default FilePrice;
