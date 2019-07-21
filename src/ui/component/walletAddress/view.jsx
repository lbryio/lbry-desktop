// @flow
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import QRCode from 'component/common/qr-code';

type Props = {
  checkAddressIsMine: string => void,
  receiveAddress: string,
  getNewAddress: () => void,
  gettingNewAddress: boolean,
};

type State = {
  showQR: boolean,
};

class WalletAddress extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showQR: false,
    };

    (this: any).toggleQR = this.toggleQR.bind(this);
  }

  componentDidMount() {
    const { checkAddressIsMine, receiveAddress, getNewAddress } = this.props;
    if (!receiveAddress) {
      getNewAddress();
    } else {
      checkAddressIsMine(receiveAddress);
    }
  }

  toggleQR() {
    this.setState({
      showQR: !this.state.showQR,
    });
  }

  render() {
    const { receiveAddress, getNewAddress, gettingNewAddress } = this.props;
    const { showQR } = this.state;

    return (
      <section className="card card--section">
        <h2 className="card__title">{__('Receive Credits')}</h2>
        <p className="card__subtitle">
          {__(
            'Use this address to receive LBC. You can generate a new address at any time, and any previous addresses will continue to work.'
          )}
        </p>
        <CopyableText label={__('Your Address')} copyable={receiveAddress} snackMessage={__('Address copied.')} />

        <div className="card__actions">
          <Button button="inverse" label={__('Get New Address')} onClick={getNewAddress} disabled={gettingNewAddress} />
          <Button button="link" label={showQR ? __('Hide QR code') : __('Show QR code')} onClick={this.toggleQR} />
        </div>

        {showQR && <QRCode value={receiveAddress} paddingTop />}
      </section>
    );
  }
}

export default WalletAddress;
