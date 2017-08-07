import React from "react";
import FormField from "component/formField";

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
  }

  handleFeeCurrencyChange(event) {
    this.setState({
      price: {
        ...this.state.price,
        feeCurrency: event.target.value,
      },
    });
    this.props.onChange(event.target.name, this.state.price);
  }

  render() {
    const {
      defaultAmount,
      defaultCurrency,
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
          defaultValue={defaultAmount}
          className="form-field__input--inline"
        />
        <FormField
          type="select"
          name="currency"
          onChange={event => this.handleFeeCurrencyChange(event)}
          defaultValue={defaultCurrency}
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
