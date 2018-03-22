// I'll come back to this
/* eslint-disable */
import React from 'react';
import Button from 'component/button';
import { Form, FormField, Submit } from 'component/common/form';

class UserEmailVerify extends React.PureComponent {
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
    try {
      const verification = JSON.parse(atob(code));
      this.props.verifyUserEmail(verification.token, verification.recaptcha);
    } catch (error) {
      this.props.verifyUserEmailFailure('Invalid Verification Token');
    }
  }

  render() {
    const { cancelButton, errorMessage, email, isPending } = this.props;
    // <FormField
    // label={__('Verification Code')}
    // errorMessage={errorMessage}
    // render{() => (
    //   <input
    //   name="code"
    //   value={this.state.code}
    //   onChange={event => {
    //     this.handleCodeChanged(event);
    //   }}
    //   />
    // )}
    // />
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <p>Please enter the verification code emailed to {email}.</p>
        {/* render help separately so it always shows */}
        <div className="form-field__helper">
          <p>
            {__('Email')} <Button href="mailto:help@lbry.io" label="help@lbry.io" /> or join our{' '}
            <Button href="https://chat.lbry.io" label="chat" />{' '}
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

export default UserEmailVerify;
/* eslint-enable */
