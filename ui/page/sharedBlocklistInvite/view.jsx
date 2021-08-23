// @flow
import React from 'react';
import { useHistory } from 'react-router';
import Button from 'component/button';
import Card from 'component/common/card';
import { Form, FormField } from 'component/common/form';
import Page from 'component/page';
import SearchChannelField from 'component/searchChannelField';
import Spinner from 'component/spinner';

const PARAM_BLOCKLIST_ID = 'id';

type Props = {
  activeChannelClaim: ?ChannelClaim,
  doSblInvite: (channelClaim: ChannelClaim, paramList: Array<SblInvite>, onComplete: (err: string) => void) => void,
  doToast: ({ message: string }) => void,
};

export default function SharedBlocklistInvite(props: Props) {
  const { activeChannelClaim, doSblInvite, doToast } = props;

  const { goBack, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get(PARAM_BLOCKLIST_ID);

  const [invitees, setInvitees] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const isInputValid = activeChannelClaim && invitees && invitees.length !== 0;

  function submitForm() {
    if (activeChannelClaim && isInputValid) {
      const paramList = invitees.map((invitee) => {
        const inviteeInfo = invitee.split('#');
        const params: SblInvite = {
          blocked_list_id: id ? parseInt(id) : undefined,
          invitee_channel_name: inviteeInfo[0],
          invitee_channel_id: inviteeInfo[1],
          message,
        };
        return params;
      });

      setError('');
      setSubmitting(true);
      doSblInvite(activeChannelClaim, paramList, handleInviteCompleted);
    }
  }

  function handleInviteCompleted(error: string) {
    setSubmitting(false);
    if (error) {
      setError(error);
    } else {
      const multipleInvitees = invitees && invitees.length > 1;
      doToast({ message: multipleInvitees ? __('Invites sent.') : __('Invite sent.') });
      goBack();
    }
  }

  function handleInviteeAdded(channelUri: string) {
    setInvitees([...invitees, channelUri]);
  }

  function handleInviteeRemoved(channelUri: string) {
    setInvitees(invitees.filter((x) => x !== channelUri));
  }

  return (
    <Page
      noSideNavigation
      className="main--half-width"
      backout={{
        backoutLabel: __('Cancel'),
        title: __('Invite'),
      }}
    >
      <Form onSubmit={submitForm}>
        <Card
          title={__('Invite others to use and contribute to this blocklist.')}
          subtitle={' '}
          className={submitting ? 'card--disabled' : ''}
          body={
            <>
              <SearchChannelField
                label={__('Invitees')}
                labelAddNew={__('Add invitee')}
                labelFoundAction={__('Add')}
                values={invitees}
                onAdd={handleInviteeAdded}
                onRemove={handleInviteeRemoved}
              />

              <FormField
                label={__('Message')}
                type="textarea"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                textAreaMaxLength={1000}
                noEmojis
              />
            </>
          }
          actions={
            <>
              <div className="section__actions">
                <Button
                  label={submitting ? <Spinner type="small" /> : __('Send')}
                  disabled={!isInputValid}
                  button="primary"
                  type="submit"
                />
                <Button label={__('Cancel')} button="link" onClick={() => goBack()} />
              </div>
              {error && <div className="help--error">{__(error)}</div>}
            </>
          }
        />
      </Form>
    </Page>
  );
}
