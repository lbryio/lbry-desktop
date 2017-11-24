import React from "react";
import Link from "component/link";
import { FormRow } from "component/form";
import UriIndicator from "component/uriIndicator";

class WalletSendTip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0.0,
    };
  }

  handleSendButtonClicked() {
    const { claim_id, uri } = this.props;
    let amount = this.state.amount;
    this.props.sendSupport(amount, claim_id, uri);
  }

  handleSupportPriceChange(event) {
    this.setState({
      amount: Number(event.target.value),
    });
  }

  render() {
    const { errorMessage, isPending, title, uri } = this.props;

    return (
      <div>
        <div className="card__title-primary">
          <h1>
            {__("Support")} <UriIndicator uri={uri} />
          </h1>
        </div>
        <div className="card__content">
          <FormRow
            label={__("Amount")}
            postfix={__("LBC")}
            min="0"
            step="any"
            type="number"
            errorMessage={errorMessage}
            helper={
              <span>
                {__(
                  'This will appear as a tip for "%s" located at %s.',
                  title,
                  uri
                ) + " "}
                <Link
                  label={__("Learn more")}
                  href="https://lbry.io/faq/tipping"
                />
              </span>
            }
            placeholder="1.00"
            onChange={event => this.handleSupportPriceChange(event)}
          />
          <div className="form-row-submit">
            <Link
              label={__("Send")}
              button="primary"
              disabled={isPending}
              onClick={this.handleSendButtonClicked.bind(this)}
            />
            <Link
              label={__("Cancel")}
              button="alt"
              navigate="/show"
              navigateParams={{ uri }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WalletSendTip;
