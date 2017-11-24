import React from "react";
import FormField from "component/formField";

class FormFieldPrice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount:
        props.defaultValue && props.defaultValue.amount
          ? props.defaultValue.amount
          : "",
      currency:
        props.defaultValue && props.defaultValue.currency
          ? props.defaultValue.currency
          : "LBC",
    };
  }

  handleChange(newValues) {
    const newState = Object.assign({}, this.state, newValues);
    this.setState(newState);
    this.props.onChange({
      amount: newState.amount,
      currency: newState.currency,
    });
  }

  handleFeeAmountChange(event) {
    this.handleChange({
      amount: event.target.value ? Number(event.target.value) : null,
    });
  }

  handleFeeCurrencyChange(event) {
    this.handleChange({ currency: event.target.value });
  }

  render() {
    const { defaultValue, placeholder, min } = this.props;

    return (
      <span className="form-field">
        <FormField
          type="number"
          name="amount"
          min={min}
          placeholder={placeholder || null}
          step="any" //Unfortunately, you cannot set a step without triggering validation that enforces a multiple of the step
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
