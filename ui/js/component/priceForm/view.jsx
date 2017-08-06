import React from "react";
import { FormField } from "component/form";

class FormFieldPrice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      price: {
        feeAmount: "",
        feeCurrency: "LBC",
      },
    };
  }

  handleFeeAmountChange(event) {
    this.setState({
      price: {
        ...this.state.price,
        feeAmount: event.target.value,
      },
    });
    this.props.onChange(event.target.name, this.state.price);
    console.log(this.state.price);
  }

  handleFeeCurrencyChange(event) {
    this.setState({
      price: {
        ...this.state.price,
        feeCurrency: event.target.value,
      },
    });
    this.props.onChange(event.target.name, this.state.price);
    console.log(this.state.price);
  }

  render() {
    const {
      defaultFeeValue,
      defaultCurrencyValue,
      placeholder,
      min,
      step,
    } = this.props;

    return (
      <span className={"form-field "}>
        <FormField
          type="number"
          name="amount"
          min={min}
          placeholder={placeholder || null}
          step={step}
          onChange={event => this.handleFeeAmountChange(event)}
          defaultValue={defaultFeeValue}
          className="form-field__input--inline"
        />
        <FormField
          type="select"
          name="currency"
          onChange={event => this.handleFeeCurrencyChange(event)}
          defaultValue={defaultCurrencyValue}
          className="form-field__input--inline"
        >
          <option value="LBC">{__("LBRY credits")}</option>
          <option value="USD">{__("US Dollars")}</option>
        </FormField>
      </span>
    );
  }
}

export default FormFieldPrice;
