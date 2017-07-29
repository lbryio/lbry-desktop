import React from "react";
import { FormField } from "component/form";

const PriceForm = props => {
  const {
    onFeeChange,
    onCurrencyChange,
    defaultFeeValue,
    defaultCurrencyValue,
    placeholder,
    min,
    step,
    isTip,
  } = props;

  return (
    <span className={"form-field " + (isTip ? "form-field--tip " : " ")}>
      <FormField
        type="number"
        min={min}
        placeholder={placeholder || null}
        step={step}
        onChange={onFeeChange}
        defaultValue={defaultFeeValue}
        className="form-field__input--inline"
      />
      <FormField
        type="select"
        onChange={onCurrencyChange}
        defaultValue={defaultCurrencyValue}
        className="form-field__input--inline"
      >
        <option value="LBC">{__("LBRY credits")}</option>
        <option value="USD">{__("US Dollars")}</option>
      </FormField>
    </span>
  );
};

export default PriceForm;
