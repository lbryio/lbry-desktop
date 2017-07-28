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
          {__(
            "To ensure you are a real and unique person, you must link a valid credit or debit card."
          )}
        </p>
        <p>
          {__(
            "A small authorization, but no actual charge, will be run on this card."
          )}
        </p>
        {errorMessage && <p className="form-field__error">{errorMessage}</p>}
        <CardVerify
          label={__("Link Card and Finish")}
          disabled={isPending}
          token={this.onToken.bind(this)}
          stripeKey="pk_live_e8M4dRNnCCbmpZzduEUZBgJO"
        />
      </div>
    );
  }
}

export default UserVerify;
