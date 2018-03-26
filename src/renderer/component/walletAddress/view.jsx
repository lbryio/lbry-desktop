// @flow
import React from 'react';
import Button from 'component/button';
import Address from 'component/address';
import * as icons from 'constants/icons';

type Props = {
  checkAddressIsMine: string => void,
  receiveAddress: string,
  getNewAddress: () => void,
  gettingNewAddress: boolean,
};

class WalletAddress extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.checkAddressIsMine(this.props.receiveAddress);
  }

  render() {
    const { receiveAddress, getNewAddress, gettingNewAddress } = this.props;

    return (
      <section className="card card--section">
        <div className="card__title">{__('Receive Credits')}</div>
        <p className="card__subtitle">
          {__('Use this wallet address to receive credits sent by another user (or yourself).')}
        </p>

        <div className="card__content">
          <Address address={receiveAddress} showCopyButton />
        </div>

        <div className="card__actions">
          <Button
            button="alt"
            label={__('Get New Address')}
            icon={icons.REFRESH}
            onClick={getNewAddress}
            disabled={gettingNewAddress}
          />
        </div>
        <div className="card__content">
          <div className="help">
            <p>
              {__(
                'You can generate a new address at any time, and any previous addresses will continue to work. Using multiple addresses can be helpful for keeping track of incoming payments from multiple sources.'
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default WalletAddress;
