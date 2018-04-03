// I'll come back to this
/* eslint-disable */
import React from 'react';
import Button from 'component/button';
import { Form, FormField, FormRow, Submit } from 'component/common/form';

class UserEmailVerify extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCodeChanged(event) {
    this.setState({
      code: String(event.target.value).trim(),
    });
  }

  handleSubmit() {
    const { code } = this.state;
    try {
      const verification = JSON.parse(atob(code));
      this.props.verifyUserEmail(verification.token, verification.recaptcha);
    } catch (error) {
      this.props.verifyUserEmailFailure('Invalid Verification Token');
    }
  }

  render() {
    const { cancelButton, errorMessage, email, isPending } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <p>Please enter the verification code emailed to {email}.</p>
        <FormRow>
          <FormField
            stretch
            name="code"
            type="text"
            placeholder="eyJyZWNhcHRjaGEiOiIw..."
            label={__('Verification Code')}
            error={errorMessage}
            value={this.state.code}
            onChange={event => this.handleCodeChanged(event)}
          />
        </FormRow>
        <div className="help">
          <p>
            {__('Email')} <Button button="link" href="mailto:help@lbry.io" label="help@lbry.io" />{' '}
            or join our <Button button="link" href="https://chat.lbry.io" label="chat" />{' '}
            {__('if you encounter any trouble with your code.')}
          </p>
        </div>
        <div className="card__actions">
          <Submit label={__('Verify')} disabled={isPending} />
          {cancelButton}
        </div>
      </Form>
    );
  }
}

export default UserEmailVerify;
/* eslint-enable */
