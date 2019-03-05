// @flow
import * as React from 'react';
import Button from 'component/button';

type Props = {
  cancelButton: React.Node,
  email: string,
  resendVerificationEmail: string => void,
  checkEmailVerified: () => void,
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
    if (this.emailVerifyCheckInterval && this.props.user.has_verified_email) {
      clearInterval(this.emailVerifyCheckInterval);
    }
  }

  componentWillUnmount() {
    if (this.emailVerifyCheckInterval) {
      clearInterval(this.emailVerifyCheckInterval);
    }
  }

  handleResendVerificationEmail() {
    this.props.resendVerificationEmail(this.props.email);
  }

  checkIfVerified() {
    const { checkEmailVerified } = this.props;
    checkEmailVerified();
  }

  emailVerifyCheckInterval: ?IntervalID;

  render() {
    const { cancelButton, email } = this.props;

    return (
      <React.Fragment>
        <header className="card__header">
          <h2 className="card__title">{__('Waiting For Verification')}</h2>
        </header>

        <div className="card__content">
          <p>
            {__('An email was sent to')} {email}.{' '}
            {__('Follow the link and you will be good to go. This will update automatically.')}
          </p>

          <div className="card__actions">
            <Button
              button="primary"
              label={__('Resend verification email')}
              onClick={this.handleResendVerificationEmail}
            />
            {cancelButton}
          </div>

          <p className="help">
            {__('Email')} <Button button="link" href="mailto:help@lbry.io" label="help@lbry.io" />{' '}
            or join our <Button button="link" href="https://chat.lbry.io" label="chat" />{' '}
            {__('if you encounter any trouble verifying.')}
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default UserEmailVerify;
