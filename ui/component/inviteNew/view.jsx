// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type FormState = {
  email: string,
};

type Props = {
  errorMessage: ?string,
  inviteNew: string => void,
  isPending: boolean,
  referralLink: string,
};

class InviteNew extends React.PureComponent<Props, FormState> {
  constructor() {
    super();

    this.state = {
      email: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChanged(event: any) {
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit() {
    const { email } = this.state;
    this.props.inviteNew(email);
  }

  render() {
    const { errorMessage, isPending, referralLink } = this.props;

    return (
      <Card
        title={__('Invite a Friend')}
        subtitle={__('When your friends start using LBRY, the network gets stronger!')}
        actions={
          <React.Fragment>
            <Form onSubmit={this.handleSubmit}>
              <FormField
                type="text"
                label="Email"
                placeholder="youremail@example.org"
                name="email"
                value={this.state.email}
                error={errorMessage}
                inputButton={
                  <Button button="secondary" type="submit" label="Invite" disabled={isPending || !this.state.email} />
                }
                onChange={event => {
                  this.handleEmailChanged(event);
                }}
              />

              <CopyableText label={__('Or share this link with your friends')} copyable={referralLink} />

              <p className="help">
                <I18nMessage
                  tokens={{
                    rewards_link: <Button button="link" navigate="/$/rewards" label={__('rewards')} />,
                    referral_faq_link: <Button button="link" label={__('FAQ')} href="https://lbry.com/faq/referrals" />,
                  }}
                >
                  Earn %rewards_link% for inviting your friends. Read our %referral_faq_link% to learn more about
                  referrals.
                </I18nMessage>
              </p>
            </Form>
          </React.Fragment>
        }
      />
    );
  }
}

export default InviteNew;
