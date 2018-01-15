import React from 'react';
import Link from 'component/link';
import { Form, FormRow, Submit } from 'component/form.js';

class UserFieldVerify extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  handleCodeChanged(event) {
    this.setState({
      code: String(event.target.value).trim(),
    });
  }

  handleSubmit() {
    const { code } = this.state;
    const { fieldType } = this.props;
    if (fieldType === 'phone') {
      this.props.verifyUserPhone(code);
    } else {
      try {
        const verification = JSON.parse(atob(code));
        this.props.verifyUserEmail(verification.token, verification.recaptcha);
      } catch (error) {
        this.props.verifyUserEmailFailure('Invalid Verification Token');
      }
    }
  }

  render() {
    const {
      cancelButton,
      emailErrorMessage,
      phoneErrorMessage,
      email,
      isPending,
      phone,
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>Please enter the verification code sent to {phone || email}.</p>
        <FormRow
          type="text"
          label={__('Verification Code')}
          name="code"
          value={this.state.code}
          onChange={event => {
            this.handleCodeChanged(event);
          }}
          errorMessage={emailErrorMessage || phoneErrorMessage}
        />
        {/* render help separately so it always shows */}
        <div className="form-field__helper">
          <p>
            {__('Email')} <Link href="mailto:help@lbry.io" label="help@lbry.io" /> or join our{' '}
            <Link href="https://chat.lbry.io" label="chat" />{' '}
            {__('if you encounter any trouble with your code.')}
          </p>
        </div>
        <div className="form-row-submit">
          <Submit label={__('Verify')} disabled={isPending} />
          {cancelButton}
        </div>
      </Form>
    );
  }
}

export default UserFieldVerify;
