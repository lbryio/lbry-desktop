// @flow
import React, { useState } from 'react';
import { isNameValid } from 'lbry-redux';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { INVALID_NAME_ERROR } from 'constants/claim';
export const DEFAULT_BID_FOR_FIRST_CHANNEL = 0.9;

type Props = {
  createChannel: (string, number) => void,
  creatingChannel: boolean,
  createChannelError: string,
  claimingReward: boolean,
  user: User,
};

function UserFirstChannel(props: Props) {
  const { createChannel, creatingChannel, claimingReward, user, createChannelError } = props;
  const { primary_email: primaryEmail } = user;
  const initialChannel = primaryEmail.split('@')[0];
  const [channel, setChannel] = useState(initialChannel);
  const [nameError, setNameError] = useState(undefined);

  function handleCreateChannel() {
    createChannel(`@${channel}`, DEFAULT_BID_FOR_FIRST_CHANNEL);
  }

  function handleChannelChange(e) {
    const { value } = e.target;
    setChannel(value);
    if (!isNameValid(value, false)) {
      setNameError(INVALID_NAME_ERROR);
    } else {
      setNameError();
    }
  }

  return (
    <Form onSubmit={handleCreateChannel}>
      <h1 className="section__title--large">{__('Create A Channel')}</h1>
      <div className="section__subtitle">
        <p>{__('A channel is your identity on the LBRY network.')}</p>
        <p>{__('You can have more than one or change this later.')}</p>
      </div>
      <section className="section__body">
        <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
          <fieldset-section>
            <label htmlFor="auth_first_channel">
              {createChannelError || nameError ? (
                <span className="error-text">{createChannelError || nameError}</span>
              ) : (
                __('Your Channel')
              )}
            </label>
            <div className="form-field__prefix">@</div>
          </fieldset-section>

          <FormField
            autoFocus
            placeholder={__('channel')}
            type="text"
            name="auth_first_channel"
            className="form-field--short"
            value={channel}
            onChange={handleChannelChange}
          />
        </fieldset-group>
        <div className="section__actions">
          <Button
            button="primary"
            type="submit"
            disabled={nameError || !channel || creatingChannel || claimingReward}
            label={creatingChannel || claimingReward ? __('Creating') : __('Create')}
          />
        </div>
      </section>
    </Form>
  );
}

export default UserFirstChannel;
