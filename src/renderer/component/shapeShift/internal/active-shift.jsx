// @flow
import * as React from 'react';
import QRCode from 'component/common/qr-code';
import { FormRow } from 'component/common/form';
import * as statuses from 'constants/shape_shift';
import Address from 'component/address';
import Button from 'component/button';
import type { Dispatch } from 'redux/actions/shape_shift';
import ShiftMarketInfo from './market_info';

type Props = {
  shiftState: ?string,
  shiftCoinType: ?string,
  shiftDepositAddress: ?string,
  shiftReturnAddress: ?string,
  shiftOrderId: ?string,
  originCoinDepositMax: ?number,
  clearShapeShift: Dispatch,
  getActiveShift: Dispatch,
  shapeShiftRate: ?number,
  originCoinDepositMax: ?number,
  originCoinDepositFee: ?number,
  originCoinDepositMin: ?string,
};

class ActiveShapeShift extends React.PureComponent<Props> {
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

  componentWillUpdate(nextProps: Props) {
    const { shiftState } = nextProps;
    if (shiftState === statuses.COMPLETE) {
      this.clearContinuousFetch();
    }
  }

  componentWillUnmount() {
    this.clearContinuousFetch();
  }

  clearContinuousFetch() {
    if (this.continousFetch) {
      clearInterval(this.continousFetch);
      this.continousFetch = null;
    }
  }

  continousFetch: ?IntervalID;

  render() {
    const {
      shiftCoinType,
      shiftDepositAddress,
      shiftReturnAddress,
      shiftOrderId,
      shiftState,
      originCoinDepositMax,
      clearShapeShift,
      shapeShiftRate,
      originCoinDepositFee,
      originCoinDepositMin,
    } = this.props;

    return (
      <div>
        {shiftState === statuses.NO_DEPOSITS && (
          <div>
            <p>
              Send up to{' '}
              <span className="credit-amount--bold">
                {originCoinDepositMax} {shiftCoinType}
              </span>{' '}
              to the address below.
            </p>
            <ShiftMarketInfo
              originCoin={shiftCoinType}
              shapeShiftRate={shapeShiftRate}
              originCoinDepositFee={originCoinDepositFee}
              originCoinDepositMin={originCoinDepositMin}
              originCoinDepositMax={originCoinDepositMax}
            />

            {shiftDepositAddress && (
              <FormRow verticallyCentered padded>
                <QRCode value={shiftDepositAddress} paddingRight />
                <Address address={shiftDepositAddress} showCopyButton padded />
              </FormRow>
            )}
          </div>
        )}

        {shiftState === statuses.RECEIVED && (
          <div className="card__content--extra-vertical-space">
            <p>
              {__('ShapeShift has received your payment! Sending the funds to your LBRY wallet.')}
            </p>
            <span className="help">{__('This can take a while, especially with BTC.')}</span>
          </div>
        )}

        {shiftState === statuses.COMPLETE && (
          <div className="card__content--extra-vertical-space">
            <p>{__('Transaction complete! You should see the new LBC in your wallet.')}</p>
          </div>
        )}
        <div className="card__actions">
          <Button
            button="primary"
            onClick={clearShapeShift}
            label={
              shiftState === statuses.COMPLETE || shiftState === statuses.RECEIVED
                ? __('Done')
                : __('Cancel')
            }
          />
          {shiftOrderId && (
            <Button
              button="inverse"
              label={__('View the status on Shapeshift.io')}
              href={`https://shapeshift.io/#/status/${shiftOrderId}`}
            />
          )}
        </div>
        {shiftState === statuses.NO_DEPOSITS &&
          shiftReturnAddress && (
            <div className="help">
              {__("If the transaction doesn't go through, ShapeShift will return your")}{' '}
              {shiftCoinType} {__('back to')} {shiftReturnAddress}
            </div>
          )}
      </div>
    );
  }
}

export default ActiveShapeShift;
