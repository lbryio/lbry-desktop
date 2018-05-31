// I'll come back to this
/* eslint-disable */
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import { Form, FormRow, FormField, Submit } from 'component/common/form';

class FormInviteNew extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      email: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
        <FormRow stretch>
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

class InviteNew extends React.PureComponent {
  render() {
    const {
      errorMessage,
      invitesRemaining,
      inviteNew,
      inviteStatusIsPending,
      isPending,
      rewardAmount,
    } = this.props;

    return (
      <section className="card card--section">
        <div className="card__title">{__('Invite a Friend')}</div>

        <div className="card__subtitle">
          {__("Or an enemy. Or your cousin Jerry, who you're kind of unsure about.")}
        </div>
        {/*
        <div className="card__content">
          {invitesRemaining > 0 &&
            <p>{__("You have %s invites remaining.", invitesRemaining)}</p>}
          {invitesRemaining <= 0 &&
            <p className="empty">{__("You have no invites.")}</p>}
        </div> */}
        <div className="card__content">
          <FormInviteNew
            errorMessage={errorMessage}
            inviteNew={inviteNew}
            isPending={isPending}
            rewardAmount={rewardAmount}
          />
        </div>
        <p className="help help--padded">
          {__('Read our')}{' '}
          <Button button="link" label={__('FAQ')} href="https://lbry.io/faq/referrals" />{' '}
          {__('to learn more about referrals')}.
        </p>
      </section>
    );
  }
}

export default InviteNew;
/* eslint-enable */
