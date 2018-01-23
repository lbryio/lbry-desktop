// @flow
import React from 'react';
import { getExampleAddress } from 'util/shape_shift';
import { FormField, Submit } from 'component/common/form';
import type { ShapeShiftFormValues, Dispatch } from 'redux/actions/shape_shift';
import ShiftMarketInfo from './market_info';

type ShapeShiftFormErrors = {
  returnAddress?: string,
};

type Props = {
  values: ShapeShiftFormValues,
  errors: ShapeShiftFormErrors,
  touched: { returnAddress: boolean },
  handleChange: Event => any,
  handleBlur: Event => any,
  handleSubmit: Event => any,
  isSubmitting: boolean,
  shiftSupportedCoins: Array<string>,
  originCoin: string,
  updating: boolean,
  getCoinStats: Dispatch,
  originCoinDepositFee: number,
  originCoinDepositMin: string,
  originCoinDepositMax: number,
  shapeShiftRate: number,
};

export default (props: Props) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    shiftSupportedCoins,
    originCoin,
    updating,
    getCoinStats,
    originCoinDepositMax,
    originCoinDepositMin,
    originCoinDepositFee,
    shapeShiftRate,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <FormField
        prefix={__('Exchange')}
        postfix={__('for LBC')}
        render={() => (
          <select
            className="form-field__input form-field__input-select"
            name="originCoin"
            onChange={e => {
              getCoinStats(e.target.value);
              handleChange(e);
            }}
          >
            {shiftSupportedCoins.map(coin => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        )}
      />
      <div>
        <div className="shapeshift__tx-info">
          {!updating &&
            originCoinDepositMax && (
              <ShiftMarketInfo
                originCoin={originCoin}
                shapeShiftRate={shapeShiftRate}
                originCoinDepositFee={originCoinDepositFee}
                originCoinDepositMin={originCoinDepositMin}
                originCoinDepositMax={originCoinDepositMax}
              />
            )}
        </div>
      </div>

      <FormField
        label={__('Return address')}
        error={touched.returnAddress && !!errors.returnAddress && errors.returnAddress}
        render={() => (
          <input
            type="text"
            name="returnAddress"
            placeholder={getExampleAddress(originCoin)}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.returnAddress}
          />
        )}
      />
      <span className="help">
        <span>
          ({__('optional but recommended')}) {__('We will return your')} {originCoin}{' '}
          {__("to this address if the transaction doesn't go through.")}
        </span>
      </span>
      <div className="card__actions card__actions--only-vertical">
        <Submit
          label={__('Begin Conversion')}
          disabled={isSubmitting || !!Object.keys(errors).length}
        />
      </div>
    </form>
  );
};
