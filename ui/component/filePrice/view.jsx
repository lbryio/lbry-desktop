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
  costInfo: ?{ includesData: boolean, cost: number },
  fetching: boolean,
  showFullPrice: boolean,
  type?: string,
  uri: string,
  // below props are just passed to <CreditAmount />
  customPrice: number,
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
    const { costInfo, doFetchCostInfoForUri, uri, fetching, claim } = props;

    if (uri && costInfo === undefined && !fetching && claim) doFetchCostInfoForUri(uri);
  };

  render() {
    const {
      costInfo,
      showFullPrice,
      showLBC,
      isFiat, // this goes
      hideFree,
      claimWasPurchased,
      type,
      claimIsMine,
      customPrice,
    } = this.props;

    if (!customPrice && (claimIsMine || !costInfo || !costInfo.cost || (!costInfo.cost && hideFree))) return null;

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
        amount={costInfo ? costInfo.cost : customPrice}
        className={className}
        isEstimate={!!costInfo && !costInfo.includesData}
        isFiat={isFiat} // this goes
        showFree
        showFullPrice={showFullPrice}
        showLBC={showLBC}
      />
    );
  }
}

export default FilePrice;
