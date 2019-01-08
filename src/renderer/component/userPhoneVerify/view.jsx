// I'll come back to this
/* eslint-disable */
import React from 'react';
import Button from 'component/button';
import { Form, FormField, Submit, FormRow } from 'component/common/form';

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
      <React.Fragment>
        <header className="card__header">
          <h2 className="card__title">{__('Enter The Verification Code')}</h2>
          <p className="card__subtitle">
            {' '}
            {__(
              `Please enter the verification code sent to +${countryCode}${phone}. Didn't receive it? `
            )}
            <Button button="link" onClick={this.reset.bind(this)} label="Go back." />
          </p>
        </header>
        <Form className="card__content" onSubmit={this.handleSubmit.bind(this)}>
          <FormRow padded>
            <FormField
              type="text"
              name="code"
              placeholder="1234"
              value={this.state.code}
              onChange={event => {
                this.handleCodeChanged(event);
              }}
              label={__('Verification Code')}
              error={phoneErrorMessage}
            />
          </FormRow>

          <div className="card__actions">
            <Submit label={__('Verify')} />
            {cancelButton}
          </div>
        </Form>

        <p className="help">
          {__('Email')} <Button button="link" href="mailto:help@lbry.io" label="help@lbry.io" /> or
          join our <Button button="link" href="https://chat.lbry.io" label="chat" />{' '}
          {__('if you encounter any trouble with your code.')}
        </p>
      </React.Fragment>
    );
  }
}

export default UserPhoneVerify;
/* eslint-enable */
