// @flow
import * as React from 'react';
import Button from 'component/button';
import { Form, FormField, Submit } from 'component/common/form';

type Props = {
  verifyUserPhone: string => void,
  resetPhone: () => void,
  cancelButton: React.Node,
  phoneErrorMessage: string,
  phone: string,
  countryCode: string,
};

type State = {
  code: string,
};

class UserPhoneVerify extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  handleCodeChanged(event: SyntheticInputEvent<*>) {
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
        <p>
          {' '}
          {__(`Please enter the verification code sent to +${countryCode}${phone}. Didn't receive it? `)}
          <Button button="link" onClick={this.reset.bind(this)} label="Go back." />
        </p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
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
            inputButton={<Submit label={__('Verify')} />}
          />

          <div className="card__actions">{cancelButton}</div>
        </Form>

        <p className="help">
          {__('Email')} <Button button="link" href="mailto:help@lbry.com" label="help@lbry.com" /> or join our{' '}
          <Button button="link" href="https://chat.lbry.com" label="chat" />{' '}
          {__('if you encounter any trouble with your code.')}
        </p>
      </React.Fragment>
    );
  }
}

export default UserPhoneVerify;
