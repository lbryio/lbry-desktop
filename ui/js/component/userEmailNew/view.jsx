import React from "react";
import Link from "component/link";
import { FormRow } from "component/form.js";

class UserEmailNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
  }

  handleEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addUserEmail(this.state.email);
  }

  render() {
    const { errorMessage, isPending } = this.props;

    return (
      <form
        onSubmit={event => {
          this.handleSubmit(event);
        }}
      >
        <FormRow
          type="text"
          label="Email"
          placeholder="scrwvwls@lbry.io"
          name="email"
          value={this.state.email}
          errorMessage={errorMessage}
          onChange={event => {
            this.handleEmailChanged(event);
          }}
        />
        <div className="form-row-submit">
          <Link
            button="primary"
            label="Next"
            disabled={isPending}
            onClick={event => {
              this.handleSubmit(event);
            }}
          />
        </div>
      </form>
    );
  }
}

export default UserEmailNew;
