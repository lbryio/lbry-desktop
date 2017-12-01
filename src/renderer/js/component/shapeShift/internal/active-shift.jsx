import React, { PureComponent } from "react";
import QRCode from "qrcode.react";
import * as statuses from "constants/shape_shift";
import Address from "component/address";
import Link from "component/link";

export default class ActiveShapeShift extends PureComponent {
  constructor() {
    super();
    this.continousFetch = undefined;
  }

  componentDidMount() {
    const { getActiveShift, shiftDepositAddress } = this.props;

    getActiveShift(shiftDepositAddress);
    this.continousFetch = setInterval(() => {
      getActiveShift(shiftDepositAddress);
    }, 10000);
  }

  componentWillUpdate(nextProps) {
    const { shiftState } = nextProps;
    if (shiftState === statuses.COMPLETE) {
      this.clearContinuousFetch();
    }
  }

  componentWillUnmount() {
    this.clearContinuousFetch();
  }

  clearContinuousFetch() {
    clearInterval(this.continousFetch);
    this.continousFetch = null;
  }

  render() {
    const {
      shiftCoinType,
      shiftDepositAddress,
      shiftReturnAddress,
      shiftOrderId,
      shiftState,
      shiftDepositLimit,
      clearShapeShift,
      doShowSnackBar,
    } = this.props;

    return (
      <div>
        {shiftState === statuses.NO_DEPOSITS && (
          <div>
            <p>
              Send up to{" "}
              <span className="credit-amount--bold">
                {shiftDepositLimit}{" "}
                <span className="credit-amount--colored">{shiftCoinType}</span>
              </span>{" "}
              to the address below.
            </p>

            <div className="shapeshift__deposit-address-wrapper">
              <Address address={shiftDepositAddress} showCopyButton />
              <div className="shapeshift__qrcode">
                <QRCode value={shiftDepositAddress} />
              </div>
            </div>
          </div>
        )}

        {shiftState === statuses.RECEIVED && (
          <div className="card__content--extra-vertical-space">
            <p>
              {__(
                "ShapeShift has received your payment! Sending the funds to your LBRY wallet."
              )}
            </p>
            <span className="help">
              {__("This can take a while, especially with BTC.")}
            </span>
          </div>
        )}

        {shiftState === statuses.COMPLETE && (
          <div className="card__content--extra-vertical-space">
            <p>
              {__(
                "Transaction complete! You should see the new LBC in your wallet."
              )}
            </p>
          </div>
        )}
        <div className="shapeshift__actions">
          <Link
            button="primary"
            onClick={clearShapeShift}
            label={
              shiftState === statuses.COMPLETE ||
              shiftState === statuses.RECEIVED
                ? __("Done")
                : __("Cancel")
            }
          />
          <span className="shapeshift__link">
            <Link
              button="text"
              label={__("View the status on Shapeshift.io")}
              href={`https://shapeshift.io/#/status/${shiftOrderId}`}
            />
          </span>
          {shiftState === statuses.NO_DEPOSITS &&
            shiftReturnAddress && (
              <div className="shapeshift__actions-help">
                <span className="help">
                  If the transaction doesn't go through, ShapeShift will return
                  your {shiftCoinType} back to {shiftReturnAddress}
                </span>
              </div>
            )}
        </div>
      </div>
    );
  }
}
