import React from "react";
import { CreditAmount } from "component/common";
import Link from "component/link";
import CardVerify from "component/cardVerify";

class UserVerify extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
    };
  }

  handleCodeChanged(event) {
    this.setState({
      code: event.target.value,
    });
  }

  onToken(data) {
    this.props.verifyUserIdentity(data.id);
  }

  render() {
    const { errorMessage, isPending, navigate } = this.props;
    return (
      <div>
        <p>
          {__(
            "To ensure you are a real person, we require a valid credit or debit card."
          ) +
            " " +
            __("There is no charge at all, now or in the future.") +
            " "}
          <Link
            href="https://lbry.io/faq/identity-requirements"
            label={__("Read More")}
          />
        </p>
        {errorMessage && <p className="form-field__error">{errorMessage}</p>}
        <p>
          <CardVerify
            label={__("Link Card and Finish")}
            disabled={isPending}
            token={this.onToken.bind(this)}
            stripeKey="pk_live_e8M4dRNnCCbmpZzduEUZBgJO"
          />
        </p>
        <p>
          {__(
            "You can continue without this step, but you will not be eligible to earn rewards."
          )}
        </p>
        <Link
          onClick={() => navigate("/discover")}
          button="alt"
          label={__("Skip Rewards")}
        />
      </div>
    );
  }
}

export default UserVerify;
