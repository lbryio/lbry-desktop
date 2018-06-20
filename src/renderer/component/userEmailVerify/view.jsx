// @flow
import * as React from 'react';
import Button from 'component/button';
import { Form, FormField, FormRow, Submit } from 'component/common/form';

type Props = {
  cancelButton: React.Node,
  errorMessage: ?string,
  email: string,
  isPending: boolean,
  onModal?: boolean,
  verifyUserEmail: (string, string) => void,
  verifyUserEmailFailure: string => void,
  resendVerificationEmail: string => void,
};

type State = {
  code: string,
};

class UserEmailVerify extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      code: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleResendVerificationEmail = this.handleResendVerificationEmail.bind(this);
  }

  handleCodeChanged(event: SyntheticInputEvent<*>) {
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

  handleResendVerificationEmail() {
    this.props.resendVerificationEmail(this.props.email);
  }

  render() {
    const { cancelButton, errorMessage, email, isPending, onModal } = this.props;

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
          {!onModal && (
            <Button
              button="link"
              label={__('Resend verification email')}
              onClick={this.handleResendVerificationEmail}
            />
          )}
        </div>
        {onModal && (
          <div className="card__actions help">
            <Button
              button="link"
              label={__('Resend verification email')}
              onClick={this.handleResendVerificationEmail}
            />
          </div>
        )}
      </Form>
    );
  }
}

export default UserEmailVerify;
