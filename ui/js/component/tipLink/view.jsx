import React from "react";
import Link from "component/link";
import { FormField } from "component/form";
import PriceForm from "component/priceForm";

class TipLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      feeAmount: "1.00",
      currency: "LBC",
    };
  }

  handleTipPublisherButtonClicked() {
    this.resetDefaults();
    this.props.onTipShow();
  }

  handleTipButtonClicked() {
    let address = this.props.address;
    let amount = this.state.feeAmount;

    this.props.setAddress(address);
    this.props.setAmount(amount);
    this.props.sendToAddress();

    this.props.onTipHide();
  }

  handleTipCancelButtonClicked() {
    this.props.onTipHide();
  }

  handleFeeAmountChange(event) {
    this.setState({
      feeAmount: event.target.value,
    });
  }

  handleCurrencyChange(event) {
    this.setState({
      currency: event.target.value,
    });
  }

  resetDefaults() {
    this.setState({
      feeAmount: "1.00",
      currency: "LBC",
    });
  }

  render() {
    const { showTipBox } = this.props;

    let tipLink = (
      <Link
        label={__("Tip")}
        button="text"
        icon="icon-gift"
        onClick={this.handleTipPublisherButtonClicked.bind(this)}
      />
    );

    let tipBox = (
      <span>
        <PriceForm
          isTip={true}
          min="0.01"
          placeholder="1.00"
          step="0.1"
          onFeeChange={event => this.handleFeeAmountChange(event)}
          defaultFeeValue={this.state.feeAmount}
          onCurrencyChange={event => this.handleCurrencyChange(event)}
          defaultCurrencyValue="LBC"
        />
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
