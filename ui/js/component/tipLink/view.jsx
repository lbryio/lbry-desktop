import React from "react";
import Link from "component/link";
import { FormRow } from "component/form";

class TipLink extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tipAmount: 0.0,
    };
  }

  handleSendButtonClicked() {
    let claim_id = this.props.claim_id;
    let amount = this.state.tipAmount;
    this.props.sendSupport(amount, claim_id);
  }

  handleSupportCancelButtonClicked() {
    this.props.hideTipBox();
  }

  handleSupportPriceChange(event) {
    this.setState({
      tipAmount: Number(event.target.value),
    });
  }

  render() {
    return (
      <div className="card__content">
        <div className="card__title-primary">
          <h4>{__("Support")}</h4>
        </div>
        <div className="card__content">
          {__(
            "Support the creator and the success of their content by sending a tip. "
          )}
          <Link label={__("Learn more")} href="https://lbry.io/faq/tipping" />
        </div>
        <div className="card__content">
          <FormRow
            label={__("Amount")}
            postfix={__("LBC")}
            min="0"
            step="0.1"
            type="number"
            placeholder="1.00"
            onChange={event => this.handleSupportPriceChange(event)}
          />
        </div>
        <div className="card__actions">
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
        </div>
      </div>
    );
  }
}

export default TipLink;
