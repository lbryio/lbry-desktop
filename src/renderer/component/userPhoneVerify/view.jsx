import React from 'react';
import Link from 'component/link';
import { Form, FormRow, Submit } from 'component/form.js';

class UserPhoneVerify extends React.PureComponent {
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
    this.props.verifyUserPhone(code);
  }

  render() {
    const { cancelButton, phoneErrorMessage, phone, countryCode } = this.props;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>
          Please enter the verification code sent to {`+${countryCode}`}
          {phone}.
        </p>
        <FormRow
          type="text"
          label={__('Verification Code')}
          name="code"
          value={this.state.code}
          onChange={event => {
            this.handleCodeChanged(event);
          }}
          errorMessage={phoneErrorMessage}
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
          <Submit label={__('Verify')} />
          {cancelButton}
        </div>
      </Form>
    );
  }
}

export default UserPhoneVerify;
