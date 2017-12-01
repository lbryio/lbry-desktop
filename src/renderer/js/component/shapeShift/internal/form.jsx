import React from "react";
import Link from "component/link";
import { getExampleAddress } from "util/shape_shift";
import { Submit, FormRow } from "component/form";

export default ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  resetForm,
  isSubmitting,
  shiftSupportedCoins,
  originCoin,
  updating,
  getCoinStats,
  receiveAddress,
  originCoinDepositMax,
  originCoinDepositMin,
  originCoinDepositFee,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <span>{__("Exchange")} </span>
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
        <span> {__("for LBC")}</span>
        <p className="shapeshift__tx-info help">
          {!updating &&
            originCoinDepositMax && (
              <span>
                {__("Exchange max")}: {originCoinDepositMax} {originCoin}
                <br />
                {__("Exchange minimun")}: {originCoinDepositMin} {originCoin}
                <br />
                {__("Fee")}: {originCoinDepositFee} LBC
              </span>
            )}
        </p>
      </div>

      <FormRow
        type="text"
        name="returnAddress"
        placeholder={getExampleAddress(originCoin)}
        label={__("Return address")}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.returnAddress}
        errorMessage={errors.returnAddress}
        hasError={touched.returnAddress && errors.returnAddress}
      />
      <span className="help">
        <span>
          ({__("optional but recommended")}) {__("We will return your")}{" "}
          {originCoin}{" "}
          {__("to this address if the transaction doesn't go through.")}
        </span>
      </span>
      <div className="shapeshift__actions">
        <Submit
          label={__("Begin Conversion")}
          disabled={isSubmitting || !!Object.keys(errors).length}
        />
      </div>
    </form>
  );
};
