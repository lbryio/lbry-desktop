// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import Button from 'component/button';
import { Form, FormRow, FormField, Submit } from 'component/common/form';

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
        <FormRow>
          <FormField
            stretch
            type="text"
            label="Email"
            placeholder="youremail@example.org"
            name="email"
            value={this.state.email}
            error={errorMessage}
            onChange={event => {
              this.handleEmailChanged(event);
            }}
          />
        </FormRow>

        <div className="card__actions">
          <Submit label="Invite" disabled={isPending} />
        </div>
      </Form>
    );
  }
}

type Props = {
  errorMessage: ?string,
  inviteNew: string => void,
  isPending: boolean,
  rewardAmount: number,
};

class InviteNew extends React.PureComponent<Props> {
  render() {
    const { errorMessage, inviteNew, isPending, rewardAmount } = this.props;

    return (
      <section className="card card--section">
        <header className="card__header">
          <h2 className="card__title">{__('Invite a Friend')}</h2>

          <p className="card__subtitle">
            {__('When your friends start using LBRY, the network gets stronger!')}
          </p>
        </header>

        <div className="card__content">
          <FormInviteNew
            errorMessage={errorMessage}
            inviteNew={inviteNew}
            isPending={isPending}
            rewardAmount={rewardAmount}
          />

          <p className="help">
            {__('Earn')} <Button button="link" navigate="/rewards" label={__('rewards')} />{' '}
            {__('for inviting your friends.')} {__('Read our')}{' '}
            <Button button="link" label={__('FAQ')} href="https://lbry.io/faq/referrals" />{' '}
            {__('to learn more about referrals')}.
          </p>
        </div>
      </section>
    );
  }
}

export default InviteNew;
/* eslint-enable react/no-multi-comp */
