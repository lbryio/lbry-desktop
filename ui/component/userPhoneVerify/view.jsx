// @flow
import * as React from 'react';
import Button from 'component/button';
import { Form, FormField, Submit } from 'component/common/form';
import I18nMessage from 'component/i18nMessage';

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
          <I18nMessage
            tokens={{
              help_link: <Button button="link" href="mailto:help@lbry.com" label="help@lbry.com" />,
              chat_link: <Button button="link" href="https://chat.lbry.com" label="chat" />,
            }}
          >
            Email %help_link% or join our %chat_link% if you encounter any trouble with your code.
          </I18nMessage>
        </p>
      </React.Fragment>
    );
  }
}

export default UserPhoneVerify;
