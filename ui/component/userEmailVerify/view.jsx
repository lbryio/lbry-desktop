// @flow
import * as React from 'react';
import Button from 'component/button';
import UserSignOutButton from 'component/userSignOutButton';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';

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
    this.emailVerifyCheckInterval = setInterval(() => {
      this.checkIfVerified();
    }, 5000);
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
        <Card
          title={isReturningUser ? __('Check Your Email') : __('Confirm Your Email')}
          subtitle={
            <p>
              {__(
                'An email was sent to %email%. Follow the link to %verify_text%. After, this page will update automatically.',
                {
                  email,
                  verify_text: isReturningUser ? __('sign in') : __('verify your email'),
                }
              )}
            </p>
          }
          actions={
            <div className="section__actions">
              <Button
                button="primary"
                label={__('Resend Email')}
                onClick={this.handleResendVerificationEmail}
                disabled={resendingEmail}
              />
              <UserSignOutButton label={__('Start Over')} />
            </div>
          }
        />
        <p className="card__bottom-gutter">
          <I18nMessage
            tokens={{
              help_link: <Button button="link" href="mailto:help@lbry.com" label="help@lbry.com" />,
              chat_link: <Button button="link" href="https://chat.lbry.com" label="chat" />,
            }}
          >
            Email %help_link% or join our %chat_link% if you encounter any trouble verifying.
          </I18nMessage>
        </p>
      </React.Fragment>
    );
  }
}

export default UserEmailVerify;
