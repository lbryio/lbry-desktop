import React from "react";
import FormField from "component/formField";

class FormFieldPrice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.defaultValue && props.defaultValue.amount
        ? props.defaultValue.amount
        : "",
      currency: props.defaultValue && props.defaultValue.currency
        ? props.defaultValue.currency
        : "LBC",
    };
  }

  dispatchChange() {
    this.props.onChange({
      amount: this.state.amount,
      currency: this.state.currency,
    });
  }

  handleFeeAmountChange(event) {
    this.state.amount = event.target.value ? Number(event.target.value) : null;
    this.dispatchChange();
  }

  handleFeeCurrencyChange(event) {
    this.state.currency = event.target.value;
    this.dispatchChange();
  }

  render() {
    const { defaultValue, placeholder, min, step } = this.props;

    return (
      <span className="form-field">
        <FormField
          type="number"
          name="amount"
          min={min}
          placeholder={placeholder || null}
          step={step}
          onChange={event => this.handleFeeAmountChange(event)}
          defaultValue={
            defaultValue && defaultValue.amount ? defaultValue.amount : ""
          }
          className="form-field__input--inline"
        />
        <FormField
          type="select"
          name="currency"
          onChange={event => this.handleFeeCurrencyChange(event)}
          defaultValue={
            defaultValue && defaultValue.currency ? defaultValue.currency : ""
          }
          className="form-field__input--inline"
        >
          <option value="LBC">{__("LBRY Credits (LBC)")}</option>
          <option value="USD">{__("US Dollars")}</option>
        </FormField>
      </span>
    );
  }
}

export default FormFieldPrice;
