// @flow
import React from 'react';
import { getExampleAddress } from 'util/shape_shift';
import { FormField, FormRow, Submit } from 'component/common/form';
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
        type="select"
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
      </FormField>
      <ShiftMarketInfo
        originCoin={originCoin}
        shapeShiftRate={shapeShiftRate}
        originCoinDepositFee={originCoinDepositFee}
        originCoinDepositMin={originCoinDepositMin}
        originCoinDepositMax={originCoinDepositMax}
      />

      <FormRow padded>
        <FormField
          label={__('Return address')}
          error={touched.returnAddress && !!errors.returnAddress && errors.returnAddress}
          type="text"
          name="returnAddress"
          className="input--address"
          placeholder={getExampleAddress(originCoin)}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.returnAddress}
        />
      </FormRow>
      <span className="help">
        <span>
          ({__('optional but recommended')})<br />
          {__('We will return your')} {originCoin}{' '}
          {__("to this address if the transaction doesn't go through.")}
        </span>
      </span>
      <div className="card__actions">
        <Submit
          button="primary"
          label={__('Begin Conversion')}
          disabled={isSubmitting || !!Object.keys(errors).length}
        />
      </div>
    </form>
  );
};
