// @flow
import React from 'react';
import Button from 'component/button';
import Address from 'component/address';
import QRCode from 'component/common/qr-code';
import * as icons from 'constants/icons';

type Props = {
  checkAddressIsMine: string => void,
  receiveAddress: string,
  getNewAddress: () => void,
  gettingNewAddress: boolean,
};

class WalletAddress extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showQR: false,
    };
  }

  toggleQR() {
    this.setState({
      showQR: !this.state.showQR,
    });
  }

  componentWillMount() {
    const { checkAddressIsMine, receiveAddress, getNewAddress } = this.props;
    if (!receiveAddress) {
      getNewAddress();
    } else {
      checkAddressIsMine(receiveAddress);
    }
  }

  render() {
    const { receiveAddress, getNewAddress, gettingNewAddress } = this.props;
    const { showQR } = this.state;

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
            button="primary"
            label={__('Get New Address')}
            icon={icons.REFRESH}
            onClick={getNewAddress}
            disabled={gettingNewAddress}
          />
          <Button
            button="link"
            label={showQR ? __('Hide QR code') : __('Show QR code')}
            onClick={this.toggleQR.bind(this)}
          />
        </div>

        {showQR && (
          <div className="card__content">
            <QRCode value={receiveAddress} paddingTop />
          </div>
        )}

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
