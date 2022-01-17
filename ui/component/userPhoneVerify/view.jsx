// @flow
import * as React from 'react';
import Button from 'component/button';
import { Form, FormField, Submit } from 'component/common/form';
import I18nMessage from 'component/i18nMessage';
import Card from 'component/common/card';
import { SITE_HELP_EMAIL } from 'config';

type Props = {
  verifyUserPhone: (string) => void,
  resetPhone: () => void,
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
    const { phoneErrorMessage, phone, countryCode } = this.props;
    return (
      <Card
        title={__('Enter the verification code')}
        subtitle={
          <>
            {__(`Please enter the verification code sent to +${countryCode}${phone}. Didn't receive it? `)}
            <Button button="link" onClick={this.reset.bind(this)} label={__('Go back.')} />
          </>
        }
        actions={
          <>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormField
                type="text"
                name="code"
                placeholder="1234"
                value={this.state.code}
                onChange={(event) => {
                  this.handleCodeChanged(event);
                }}
                label={__('Verification Code')}
                error={phoneErrorMessage}
                inputButton={<Submit label={__('Verify')} />}
              />
            </Form>
            <p className="help">
              <I18nMessage
                tokens={{
                  help_link: <Button button="link" href={`mailto:${SITE_HELP_EMAIL}`} label={`${SITE_HELP_EMAIL}`} />,
                  chat_link: <Button button="link" href="https://chat.odysee.com" label={__('chat')} />,
                }}
              >
                Email %help_link% or join our %chat_link% if you encounter any trouble with your code.
              </I18nMessage>
            </p>
          </>
        }
      />
    );
  }
}

export default UserPhoneVerify;
