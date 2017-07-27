import React from "react";
import Link from "component/link";
import { FormField } from "component/form";

class TipLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showTipBox: false,
      feeAmount: "1.00",
    };
  }

  handleTipPublisherButtonClicked() {
    this.setState({
      showTipBox: true,
    });
  }

  handleTipButtonClicked() {
    let address = this.props.claim.address;
    let amount = this.state.feeAmount;

    this.props.setAddress(address);
    this.props.setAmount(amount);
    this.props.sendToAddress();

    this.setState({
      showTipBox: false,
    });
  }

  handleTipCancelButtonClicked() {
    this.setState({
      showTipBox: false,
    });
  }

  handleFeeAmountChange(event) {
    this.setState({
      feeAmount: event.target.value,
    });
  }

  render() {
    const { showTipBox } = this.state;

    let tipLink = (
      <Link
        label={__("Tip Publisher")}
        button="text"
        icon="icon-gift"
        onClick={this.handleTipPublisherButtonClicked.bind(this)}
      />
    );

    let tipBox = (
      <span>
        <FormField
          type="number"
          className="form-field__input--inline"
          step="0.1"
          placeholder="1.00"
          defaultValue="1.00"
          min="0.01"
          postfix={__("LBC")}
          onChange={event => this.handleFeeAmountChange(event)}
        />
        {__("  ")}
        <Link
          label={__("Tip")}
          button="primary"
          onClick={this.handleTipButtonClicked.bind(this)}
        />
        <Link
          label={__("Cancel")}
          button="alt"
          onClick={this.handleTipCancelButtonClicked.bind(this)}
        />
      </span>
    );

    return (
      <div className="menu-container">
        {showTipBox ? tipBox : tipLink}
      </div>
    );
  }
}

export default TipLink;
