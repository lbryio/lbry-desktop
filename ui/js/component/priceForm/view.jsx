import React from "react";
import { FormField } from "component/form";

const FormFieldPrice = props => {
  const {
    onChange,
    onCurrencyChange,
    defaultFeeValue,
    defaultCurrencyValue,
    placeholder,
    min,
    step,
  } = props;

  return (
    <span className={"form-field "}>
      <FormField
        type="number"
        name="amount"
        min={min}
        placeholder={placeholder || null}
        step={step}
        onChange={onChange}
        defaultValue={defaultFeeValue}
        className="form-field__input--inline"
      />
      <FormField
        type="select"
        name="currency"
        onChange={onChange}
        defaultValue={defaultCurrencyValue}
        className="form-field__input--inline"
      >
        <option value="LBC">{__("LBRY credits")}</option>
        <option value="USD">{__("US Dollars")}</option>
      </FormField>
    </span>
  );
};

export default FormFieldPrice;
