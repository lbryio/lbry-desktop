import React from "react";
import { CreditAmount } from "component/common";
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
    const { errorMessage, isPending, reward } = this.props;
    return (
      <div>
        <p>
          <span>
            Please link a credit card to confirm your identity and receive{" "}
          </span>
          {reward
            ? <CreditAmount amount={parseFloat(reward.reward_amount)} />
            : <span>your reward</span>}
          {"."}
        </p>
        <p>{__("This is to prevent abuse. You will not be charged.")}</p>
        {errorMessage && <p className="form-field__error">{errorMessage}</p>}
        <CardVerify
          label={__("Link Card and Finish")}
          disabled={isPending}
          token={this.onToken.bind(this)}
          stripeKey="pk_test_NoL1JWL7i1ipfhVId5KfDZgo"
        />
      </div>
    );
  }
}

export default UserVerify;
