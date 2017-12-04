import React from "react";
import Link from "component/link";
import { Form, FormRow, Submit } from "component/form.js";

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

  handleSubmit() {
    const { email } = this.state;
    this.props.addUserEmail(email);
  }

  render() {
    const { errorMessage, isPending } = this.props;

    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>
          {__(
            "This process is required to prevent abuse of the rewards program."
          )}
        </p>
        <p>
          {__(
            "We will also contact you about updates and new content, but you can unsubscribe at any time."
          )}
        </p>
        <FormRow
          type="text"
          label="Email"
          placeholder="youremail@example.org"
          name="email"
          value={this.state.email}
          errorMessage={errorMessage}
          onChange={event => {
            this.handleEmailChanged(event);
          }}
        />
        <div className="form-row-submit">
          <Submit label="Next" disabled={isPending} />
        </div>
      </Form>
    );
  }
}

export default UserEmailNew;
