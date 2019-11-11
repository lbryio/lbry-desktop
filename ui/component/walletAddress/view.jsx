// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import QRCode from 'component/common/qr-code';
import Card from 'component/common/card';

type Props = {
  checkAddressIsMine: string => void,
  receiveAddress: string,
  getNewAddress: () => void,
  gettingNewAddress: boolean,
  history: { goBack: () => void },
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
    const { receiveAddress, getNewAddress, gettingNewAddress, history } = this.props;
    const { showQR } = this.state;

    return (
      <Card
        title={
          <React.Fragment>
            {__('Receive Credits')}
            <Button button="close" icon={ICONS.REMOVE} onClick={() => history.goBack()} />
          </React.Fragment>
        }
        subtitle={__('Use this address to receive LBC.')}
        actions={
          <React.Fragment>
            <CopyableText label={__('Your Address')} copyable={receiveAddress} snackMessage={__('Address copied.')} />

            <div className="card__actions">
              {!IS_WEB && (
                <Button
                  button="inverse"
                  label={__('Get New Address')}
                  onClick={getNewAddress}
                  disabled={gettingNewAddress}
                />
              )}
              <Button button="link" label={showQR ? __('Hide QR code') : __('Show QR code')} onClick={this.toggleQR} />
            </div>
            <p className="help">
              {!IS_WEB &&
                __('You can generate a new address at any time, and any previous addresses will continue to work.')}
            </p>

            {showQR && <QRCode value={receiveAddress} paddingTop />}
          </React.Fragment>
        }
      />
    );
  }
}

export default WalletAddress;
