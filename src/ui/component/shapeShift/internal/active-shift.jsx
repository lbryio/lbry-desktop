// @flow
import * as React from 'react';
import QRCode from 'component/common/qr-code';
import * as statuses from 'constants/shape_shift';
import CopyableText from 'component/copyableText';
import Button from 'component/button';
import type { Dispatch, ThunkAction } from 'types/redux';
import type { Action } from 'redux/actions/shape_shift';

import ShiftMarketInfo from './market_info';

type Props = {
  shiftState: ?string,
  shiftCoinType: ?string,
  shiftDepositAddress: string,
  shiftReturnAddress: ?string,
  shiftOrderId: ?string,
  originCoinDepositMax: ?number,
  clearShapeShift: () => (Dispatch<Action>) => ThunkAction<Action>,
  getActiveShift: string => (Dispatch<Action>) => ThunkAction<Action>,
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
              <strong>
                {originCoinDepositMax} {shiftCoinType}
              </strong>{' '}
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
              <React.Fragment>
                <QRCode value={shiftDepositAddress} paddingRight />
                <CopyableText copyable={shiftDepositAddress} />
              </React.Fragment>
            )}
          </div>
        )}

        {shiftState === statuses.RECEIVED && (
          <div>
            <p>
              {__('ShapeShift has received your payment! Sending the funds to your LBRY wallet.')}
            </p>
            <span className="help">{__('This can take a while, especially with BTC.')}</span>
          </div>
        )}

        {shiftState === statuses.COMPLETE && (
          <div>
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
        {shiftState === statuses.NO_DEPOSITS && shiftReturnAddress && (
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
