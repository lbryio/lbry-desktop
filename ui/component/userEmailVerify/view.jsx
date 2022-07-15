// @flow
import * as React from 'react';
import Button from 'component/button';
import UserSignOutButton from 'component/userSignOutButton';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';
import { SITE_HELP_EMAIL } from 'config';
const THIRTY_SECONDS_IN_MS = 30000;
type Props = {
  email: string,
  isReturningUser: boolean,
  resendVerificationEmail: (string) => void,
  resendingEmail: boolean,
  checkEmailVerified: () => void,
  toast: (string) => void,
  user: {
    has_verified_email: boolean,
  },
};

type State = {
  wait: boolean,
};

class UserEmailVerify extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.emailVerifyCheckInterval = null;
    this.state = { wait: false };
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
    if (!this.state.wait) {
      resendVerificationEmail(email);
      toast(__('New email sent.'));
      this.setState({
        wait: true,
      });
      setTimeout(() => this.setState({ wait: false }), THIRTY_SECONDS_IN_MS);
    } else {
      toast(__('Please wait a bit longer before requesting again.'));
    }
  }

  checkIfVerified() {
    const { checkEmailVerified } = this.props;
    checkEmailVerified();
  }

  emailVerifyCheckInterval: ?IntervalID;

  render() {
    const { email, isReturningUser, resendingEmail } = this.props;

    return (
      <div className="main__sign-up">
        <Card
          title={isReturningUser ? __('Check Your email') : __('Confirm your account')}
          subtitle={
            <p>
              {__(
                'We just sent an email to %email% with a link for you to %verify_text%. Remember to check other email folders like spam or promotions.',
                {
                  email,
                  verify_text: isReturningUser ? __('log in') : __('verify your account'),
                }
              )}
            </p>
          }
          actions={
            <React.Fragment>
              <div className="section__actions">
                <Button
                  button="primary"
                  label={__('Resend Link')}
                  onClick={this.handleResendVerificationEmail}
                  disabled={resendingEmail}
                />
                <UserSignOutButton label={__('Start Over')} />
              </div>
              <p className="help--card-actions">
                <I18nMessage
                  tokens={{
                    help_link: <Button button="link" href={`mailto:${SITE_HELP_EMAIL}`} label={`${SITE_HELP_EMAIL}`} />,
                    chat_link: <Button button="link" href="https://chat.odysee.com" label={__('chat')} />,
                  }}
                >
                  Email %help_link% or join our %chat_link% if you encounter any trouble verifying.
                </I18nMessage>
              </p>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}

export default UserEmailVerify;
