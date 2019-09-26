// @flow
import React, { useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import analytics from 'analytics';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
};

// "Email regex that 99.99% works"
// https://emailregex.com/
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function UserEmailNew(props: Props) {
  const { errorMessage, isPending, addUserEmail } = props;
  const [newEmail, setEmail] = useState('');
  const valid = newEmail.match(EMAIL_REGEX);

  function handleSubmit() {
    addUserEmail(newEmail);
    analytics.emailProvidedEvent();

    // @if TARGET='web'
    Lbryio.call('user_tag', 'edit', { add: 'lbrytv' });
    // @endif
  }

  return (
    <div>
      <h1 className="section__title--large">{__('Welcome To LBRY')}</h1>
      <p className="section__subtitle">{__('Create a new account or sign in.')}</p>
      <Form onSubmit={handleSubmit} className="section__body">
        <FormField
          autoFocus
          className="form-field--short"
          placeholder={__('hotstuff_96@hotmail.com')}
          type="email"
          id="sign_up_email"
          label={__('Email')}
          value={newEmail}
          error={errorMessage}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="card__actions">
          <Button button="primary" type="submit" label={__('Continue')} disabled={!newEmail || !valid || isPending} />
        </div>
      </Form>
    </div>
  );
}

export default UserEmailNew;
