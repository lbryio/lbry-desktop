// I'll come back to this
/* eslint-disable */
import React from 'react';
import Button from 'component/button';
import { Form, FormElement, Submit } from 'component/common/form';

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

  reset() {
    const { resetPhone } = this.props;
    resetPhone();
  }

  render() {
    const { cancelButton, phoneErrorMessage, phone, countryCode } = this.props;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>
          {__(
            `Please enter the verification code sent to +${countryCode}${phone}. Didn't receive it? `
          )}
          <Button onClick={this.reset.bind(this)} label="Go back." />
        </p>
        <FormElement
          label={__('Verification Code')}
          errorMessage={phoneErrorMessage}
          render={() => (
            <input
              type="text"
              name="code"
              value={this.state.code}
              onChange={event => {
                this.handleCodeChanged(event);
              }}
            />
          )}
        />
        {/* render help separately so it always shows */}
        <div className="form-field__helper">
          <p>
            {__('Email')} <Button href="mailto:help@lbry.io" label="help@lbry.io" /> or join our{' '}
            <Button href="https://chat.lbry.io" label="chat" />{' '}
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
/* eslint-enable */
