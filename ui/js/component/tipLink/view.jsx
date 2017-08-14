import React from "react";
import Link from "component/link";
import FormFieldPrice from "component/formFieldPrice";

class TipLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      feeAmount: "1.00",
      currency: "LBC",
    };
  }

  handleSupportButtonClicked() {
    this.resetDefaults();
    this.props.onTipShow();
  }

  handleSendButtonClicked() {
    let claim_id = this.props.claim_id;
    let amount = this.state.feeAmount;

    this.props.sendSupport(amount, claim_id);

    this.props.onTipHide();
  }

  handleSupportCancelButtonClicked() {
    this.props.onTipHide();
  }

  handleSupportPriceChange(newValue) {
    this.setState({
      feeAmount: newValue.amount,
      feeCurrency: newValue.currency,
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
    const { feeAmount, currency } = this.state;

    let tipLink = (
      <Link
        label={__("Support")}
        button="text"
        icon="icon-gift"
        onClick={this.handleSupportButtonClicked.bind(this)}
      />
    );

    let tipBox = (
      <span>
        <FormFieldPrice
          min="0"
          placeholder="1.00"
          step="0.1"
          onChange={value => this.handleSupportPriceChange(value)}
          defaultValue={{ amount: feeAmount, currency: currency }}
        />
        <Link
          label={__("Send")}
          button="primary"
          onClick={this.handleSendButtonClicked.bind(this)}
        />
        <Link
          label={__("Cancel")}
          button="alt"
          onClick={this.handleSupportCancelButtonClicked.bind(this)}
        />
        <div className="form-field__helper">
          {__("This sends the entered amount of LBCs to the publisher.")}
        </div>
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
