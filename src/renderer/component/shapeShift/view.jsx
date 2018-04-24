// @flow
import * as React from 'react';
import { Formik } from 'formik';
import { validateShapeShiftForm } from 'util/shape_shift';
import Button from 'component/button';
import type { ShapeShiftState } from 'redux/reducers/shape_shift';
import type { Dispatch, ShapeShiftFormValues } from 'redux/actions/shape_shift';
import ShapeShiftForm from './internal/form';
import ActiveShapeShift from './internal/active-shift';

type Props = {
  shapeShift: ShapeShiftState,
  getCoinStats: Dispatch,
  createShapeShift: Dispatch,
  clearShapeShift: Dispatch,
  getActiveShift: Dispatch,
  shapeShiftInit: Dispatch,
  receiveAddress: string,
};

class ShapeShift extends React.PureComponent<Props> {
  componentDidMount() {
    const {
      shapeShiftInit,
      shapeShift: { hasActiveShift, shiftSupportedCoins },
    } = this.props;

    if (!hasActiveShift && !shiftSupportedCoins.length) {
      // calls shapeshift to see list of supported coins for shifting
      shapeShiftInit();
    }
  }

  render() {
    const {
      getCoinStats,
      receiveAddress,
      createShapeShift,
      shapeShift,
      clearShapeShift,
      getActiveShift,
    } = this.props;

    const {
      loading,
      updating,
      error,
      shiftSupportedCoins,
      hasActiveShift,
      originCoin,
      // ShapeShift response values
      originCoinDepositMax,
      originCoinDepositMin,
      originCoinDepositFee,
      shiftDepositAddress,
      shiftReturnAddress,
      shiftCoinType,
      shiftOrderId,
      shiftState,
      shapeShiftRate,
    } = shapeShift;

    const initialFormValues: ShapeShiftFormValues = {
      receiveAddress,
      originCoin: 'BTC',
      returnAddress: '',
    };

    return (
      <section className="card card--section">
        <div className="card__title">{__('Convert Crypto to LBC')}</div>
        <p className="card__subtitle">
          {__('Powered by ShapeShift. Read our FAQ')}{' '}
          <Button button="link" label={__('here')} href="https://lbry.io/faq/shapeshift" />.
          {hasActiveShift &&
            shiftState !== 'complete' && <span>{__('This will update automatically.')}</span>}
        </p>

        <div className="card__content">
          {error && <div className="form-field__error">{error}</div>}
          {!hasActiveShift && (
            <Formik
              onSubmit={createShapeShift}
              validate={validateShapeShiftForm}
              initialValues={initialFormValues}
              render={formProps => (
                <ShapeShiftForm
                  {...formProps}
                  updating={updating}
                  originCoin={originCoin}
                  shiftSupportedCoins={shiftSupportedCoins}
                  getCoinStats={getCoinStats}
                  receiveAddress={receiveAddress}
                  originCoinDepositMax={originCoinDepositMax}
                  originCoinDepositMin={originCoinDepositMin}
                  originCoinDepositFee={originCoinDepositFee}
                  shapeShiftRate={shapeShiftRate}
                />
              )}
            />
          )}
          {hasActiveShift && (
            <ActiveShapeShift
              getActiveShift={getActiveShift}
              shiftCoinType={shiftCoinType}
              shiftReturnAddress={shiftReturnAddress}
              shiftDepositAddress={shiftDepositAddress}
              shiftOrderId={shiftOrderId}
              shiftState={shiftState}
              clearShapeShift={clearShapeShift}
              originCoinDepositMax={originCoinDepositMax}
              originCoinDepositMin={originCoinDepositMin}
              originCoinDepositFee={originCoinDepositFee}
              shapeShiftRate={shapeShiftRate}
              updating={updating}
            />
          )}
        </div>
      </section>
    );
  }
}

export default ShapeShift;
