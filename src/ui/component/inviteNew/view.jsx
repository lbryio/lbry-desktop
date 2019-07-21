// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';

type FormProps = {
  inviteNew: string => void,
  errorMessage: ?string,
  isPending: boolean,
};

type FormState = {
  email: string,
};

class FormInviteNew extends React.PureComponent<FormProps, FormState> {
  constructor() {
    super();

    this.state = {
      email: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit() {
    const { email } = this.state;
    this.props.inviteNew(email);
  }

  render() {
    const { errorMessage, isPending } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormField
          type="text"
          label="Email"
          placeholder="youremail@example.org"
          name="email"
          value={this.state.email}
          error={errorMessage}
          inputButton={
            <Button button="inverse" type="submit" label="Invite" disabled={isPending || !this.state.email} />
          }
          onChange={event => {
            this.handleEmailChanged(event);
          }}
        />
      </Form>
    );
  }
}

type Props = {
  errorMessage: ?string,
  inviteNew: string => void,
  isPending: boolean,
  rewardAmount: number,
  referralLink: string,
};

class InviteNew extends React.PureComponent<Props> {
  render() {
    const { errorMessage, inviteNew, isPending, rewardAmount, referralLink } = this.props;

    return (
      <section className="card card--section">
        <h2 className="card__title">{__('Invite a Friend')}</h2>
        <p className="card__subtitle">{__('When your friends start using LBRY, the network gets stronger!')}</p>

        <FormInviteNew
          errorMessage={errorMessage}
          inviteNew={inviteNew}
          isPending={isPending}
          rewardAmount={rewardAmount}
        />
        <CopyableText label={__('Or share this link with your friends')} copyable={referralLink} />

        <p className="help">
          {__('Earn')} <Button button="link" navigate="/$/rewards" label={__('rewards')} />{' '}
          {__('for inviting your friends.')} {__('Read our')}{' '}
          <Button button="link" label={__('FAQ')} href="https://lbry.com/faq/referrals" />{' '}
          {__('to learn more about referrals')}.
        </p>
      </section>
    );
  }
}

export default InviteNew;
