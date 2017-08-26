import React from "react";
import Link from "component/link";
import { Address } from "component/common";

class WalletAddress extends React.PureComponent {
  componentWillMount() {
    this.props.checkAddressIsMine(this.props.receiveAddress);
  }

  render() {
    const { receiveAddress, getNewAddress, gettingNewAddress } = this.props;

    return (
      <section className="card">
        <div className="card__title-primary">
          <h3>{__("Wallet Address")}</h3>
        </div>
        <div className="card__content">
          <p>
            {__(
              "Use this address to receive credits send by another user (or yourself)."
            )}
          </p>
          <Address address={receiveAddress} />
        </div>
        <div className="card__actions">
          <Link
            label={__("Get New Address")}
            button="primary"
            icon="icon-refresh"
            onClick={getNewAddress}
            disabled={gettingNewAddress}
          />
        </div>
        <div className="card__content">
          <div className="help">
            <p>
              {__(
                "You can generate a new address at any time, and any previous addresses will continue to work. Using multiple addresses can be helpful for keeping track of incoming payments from multiple sources."
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default WalletAddress;
