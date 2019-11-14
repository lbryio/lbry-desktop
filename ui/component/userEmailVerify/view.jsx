// @flow
import * as React from 'react';
import Button from 'component/button';
import UserSignOutButton from 'component/userSignOutButton';

type Props = {
  email: string,
  isReturningUser: boolean,
  resendVerificationEmail: string => void,
  resendingEmail: boolean,
  checkEmailVerified: () => void,
  toast: string => void,
  user: {
    has_verified_email: boolean,
  },
};

class UserEmailVerify extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.emailVerifyCheckInterval = null;
    (this: any).handleResendVerificationEmail = this.handleResendVerificationEmail.bind(this);
  }

  componentDidMount() {
    this.emailVerifyCheckInterval = setInterval(() => this.checkIfVerified(), 5000);
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (this.emailVerifyCheckInterval && user && user.has_verified_email) {
      clearInterval(this.emailVerifyCheckInterval);
    }
  }

  componentWillUnmount() {
    if (this.emailVerifyCheckInterval) {
      clearInterval(this.emailVerifyCheckInterval);
    }
  }

  handleResendVerificationEmail() {
    const { email, resendVerificationEmail, toast } = this.props;
    resendVerificationEmail(email);
    toast(__('New email sent.'));
  }

  checkIfVerified() {
    const { checkEmailVerified } = this.props;
    checkEmailVerified();
  }

  emailVerifyCheckInterval: ?IntervalID;

  render() {
    const { email, isReturningUser, resendingEmail } = this.props;

    return (
      <React.Fragment>
        <h1 className="section__title--large">{isReturningUser ? __('Check Your Email') : __('Confirm Your Email')}</h1>

        <p className="section__subtitle">
          {__('An email was sent to %email%. Follow the link to %verify_text%. After, this page will update automatically.', {
            email,
            verify_text: isReturningUser ? __('sign in') : __('verify your email'),
          })}
        </p>

        <div className="section__body section__actions">
          <Button
            button="primary"
            label={__('Resend Email')}
            onClick={this.handleResendVerificationEmail}
            disabled={resendingEmail}
          />
          <UserSignOutButton label={__('Start Over')} />
        </div>

        <p className="help">
          {__('Email')} <Button button="link" href="mailto:help@lbry.com" label="help@lbry.com" /> or join our{' '}
          <Button button="link" href="https://chat.lbry.com" label="chat" />{' '}
          {__('if you encounter any trouble verifying.')}
        </p>
      </React.Fragment>
    );
  }
}

export default UserEmailVerify;
