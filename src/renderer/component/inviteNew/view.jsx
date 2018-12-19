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

        <div className="card__content">
          <div className="card__actions">
            <Submit label="Invite" disabled={isPending} />
          </div>
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
        <header className="card__header">
          <h2 className="card__title">{__('Invite a Friend')}</h2>

          <p className="card__subtitle">
            {__("Or an enemy. Or your cousin Jerry, who you're kind of unsure about.")}
          </p>
        </header>

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

        <div className="card__content">
          <p className="help">
            {__('Read our')}{' '}
            <Button button="link" label={__('FAQ')} href="https://lbry.io/faq/referrals" />{' '}
            {__('to learn more about referrals')}.
          </p>
        </div>
      </section>
    );
  }
}

export default InviteNew;
/* eslint-enable */
