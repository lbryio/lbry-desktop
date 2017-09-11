import React from "react";
import Link from "component/link";
import { Form, FormRow, Submit } from "component/form.js";

class UserEmailVerify extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
    };
  }

  handleCodeChanged(event) {
    this.setState({
      code: String(event.target.value).trim(),
    });
  }

  handleSubmit() {
    const { code } = this.state;
    this.props.verifyUserEmail(code);
  }

  render() {
    const { errorMessage, isPending } = this.props;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>{__("Please enter the verification code emailed to you.")}</p>
        <FormRow
          type="text"
          label={__("Verification Code")}
          name="code"
          value={this.state.code}
          onChange={event => {
            this.handleCodeChanged(event);
          }}
          errorMessage={errorMessage}
        />
        {/* render help separately so it always shows */}
        <div className="form-field__helper">
          <p>
            {__("Email")}{" "}
            <Link href="mailto:help@lbry.io" label="help@lbry.io" />{" "}
            {__("if you encounter any trouble with your code.")}
          </p>
        </div>
        <div className="form-row-submit form-row-submit--with-footer">
          <Submit label={__("Verify")} disabled={this.state.submitting} />
        </div>
      </Form>
    );
  }
}

export default UserEmailVerify;
