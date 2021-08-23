// @flow
import React from 'react';
import { useHistory } from 'react-router';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import Card from 'component/common/card';
import { Form, FormField } from 'component/common/form';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import Page from 'component/page';
import Spinner from 'component/spinner';
import usePersistedState from 'effects/use-persisted-state';

const DEFAULT_STRIKE_HOURS = 4;

type Props = {
  activeChannelClaim: ?ChannelClaim,
  doSblUpdate: (channelClaim: ChannelClaim, params: SblUpdate, onComplete: (error: string) => void) => void,
  doToast: ({ message: string }) => void,
};

export default function SharedBlocklistEdit(props: Props) {
  const { activeChannelClaim, doSblUpdate, doToast } = props;

  const { goBack, location } = useHistory();

  const sbl = location.state;
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [strike1, setStrike1] = React.useState(DEFAULT_STRIKE_HOURS);
  const [strike2, setStrike2] = React.useState(DEFAULT_STRIKE_HOURS);
  const [strike3, setStrike3] = React.useState(DEFAULT_STRIKE_HOURS);
  const [appealAmount, setAppealAmount] = React.useState(0);
  const [memberInviteEnabled, setMemberInviteEnabled] = usePersistedState('sblEdit:memberInviteEnabled', true);
  const [inviteExpiration, setInviteExpiration] = usePersistedState('sblEdit:inviteExpiration', 0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const submitDisabled = !name || !description;

  function submitForm() {
    const params: SblUpdate = {
      name,
      category,
      description,
      strike_one: strike1,
      strike_two: strike2,
      strike_three: strike3,
      curse_jar_amount: appealAmount,
      member_invite_enabled: memberInviteEnabled,
      invite_expiration: inviteExpiration,
    };

    if (activeChannelClaim) {
      setError('');
      setSubmitting(true);
      doSblUpdate(activeChannelClaim, params, handleUpdateCompleted);
    }
  }

  function handleUpdateCompleted(error: string) {
    setSubmitting(false);
    if (error) {
      setError(error);
    } else {
      doToast({ message: __('Shared blocklist updated.') });
      goBack();
    }
  }

  // Reload data from existing sbl
  React.useEffect(() => {
    if (sbl) {
      setName(sbl.name);
      setCategory(sbl.category);
      setDescription(sbl.description);
      setStrike1(sbl.strike_one);
      setStrike2(sbl.strike_two);
      setStrike3(sbl.strike_three);
      setAppealAmount(sbl.curse_jar_amount);
      setMemberInviteEnabled(sbl.member_invite_enabled);
      setInviteExpiration(sbl.invite_expiration);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page
      noSideNavigation
      className="main--half-width"
      backout={{
        backoutLabel: __('Cancel'),
        title: sbl ? __('Edit shared blocklist') : __('Create shared blocklist'),
      }}
    >
      <Form onSubmit={submitForm}>
        <Card
          className={submitting ? 'sbl-edit card--disabled' : 'sbl-edit '}
          body={
            <>
              <ChannelSelector hideAnon />
              <FormField
                label={__('Blocklist name')}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormField
                label={__('Category')}
                type="text"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <FormField
                label={__('Description')}
                type="textarea"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                textAreaMaxLength={1000}
                noEmojis
              />
              <fieldset-section>
                <label>{__('Timeout (hours)')}</label>
                <div className="section section__flex">
                  <FormField
                    label={__('Strike 1')}
                    placeholder={__('Strike 1 timeout in hours')}
                    type="number"
                    name="strike_one"
                    min={0}
                    step={1}
                    value={strike1}
                    onChange={(e) => setStrike1(parseInt(e.target.value))}
                  />
                  <FormField
                    label={__('Strike 2')}
                    placeholder={__('Strike 2 timeout in hours')}
                    type="number"
                    name="strike_two"
                    min={0}
                    step={1}
                    value={strike2}
                    onChange={(e) => setStrike2(parseInt(e.target.value))}
                  />
                  <FormField
                    label={__('Strike 3')}
                    placeholder={__('Strike 3 timeout in hours')}
                    type="number"
                    name="strike_three"
                    min={0}
                    step={1}
                    value={strike3}
                    onChange={(e) => setStrike3(parseInt(e.target.value))}
                  />
                </div>
              </fieldset-section>
              <FormField
                label={<I18nMessage tokens={{ lbc: <LbcSymbol /> }}>Auto-appeal minimum %lbc%</I18nMessage>}
                name="curse_jar_amount"
                className="form-field--price-amount"
                type="number"
                placeholder="1"
                value={appealAmount}
                onChange={(e) => setAppealAmount(parseFloat(e.target.value))}
              />
              <FormField
                label={__('Invite expiration (hours)')}
                placeholder={__('Set to 0 for no expiration.')}
                type="number"
                name="invite_expiration"
                min={0}
                step={1}
                value={inviteExpiration}
                onChange={(e) => setInviteExpiration(parseInt(e.target.value))}
              />
              <FormField
                label={__('Allow members to invite others')}
                type="checkbox"
                name="member_invite_enabled"
                checked={memberInviteEnabled}
                onChange={() => setMemberInviteEnabled(!memberInviteEnabled)}
              />
            </>
          }
          actions={
            <>
              <div className="section__actions">
                <Button
                  label={submitting ? <Spinner type="small" /> : __('Done')}
                  button="primary"
                  type="submit"
                  disabled={submitDisabled}
                />
                <Button button="link" label={__('Cancel')} onClick={() => goBack()} />
              </div>
              {error && <div className="help--error">{__(error)}</div>}
            </>
          }
        />
      </Form>
    </Page>
  );
}
