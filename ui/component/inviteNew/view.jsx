// @flow
import React, { useEffect, useState } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';
import Card from 'component/common/card';
import { URL } from 'config';
import SelectChannel from 'component/selectChannel';
import analytics from 'analytics';
import I18nMessage from 'component/i18nMessage';

type Props = {
  errorMessage: ?string,
  inviteNew: string => void,
  isPending: boolean,
  referralLink: string,
  referralCode: string,
  channels: any,
  resolvingUris: Array<string>,
  resolveUris: (Array<string>) => void,
};

function InviteNew(props: Props) {
  const { inviteNew, errorMessage, isPending, referralCode = '', channels, resolveUris, resolvingUris } = props;
  // Email
  const [email, setEmail] = useState('');
  function handleSubmit() {
    inviteNew(email);
  }

  function handleEmailChanged(event: any) {
    setEmail(event.target.value);
  }

  // Referral link
  const [referralSource, setReferralSource] = useState(referralCode);
  /* Canonical Referral links
   * We need to make sure our channels are resolved so that canonical_url is present
   */

  function handleReferralChange(code) {
    setReferralSource(code);
    // TODO: keep track of this in an array?
    if (code !== referralCode) {
      analytics.apiLogPublish(channels.find(ch => ch.name === code));
    }
  }

  const [resolveStarted, setResolveStarted] = useState(false);
  const [hasResolved, setHasResolved] = useState(false);
  // join them so that useEffect doesn't update on new objects
  const uris = channels && channels.map(channel => channel.permanent_url).join(',');
  const channelCount = channels && channels.length;
  const resolvingCount = resolvingUris && resolvingUris.length;

  const topChannel =
    channels &&
    channels.reduce((top, channel) =>
      (top && top.meta && top.meta.claims_in_channel) > channel.meta.claims_in_channel ? top : channel
    );
  const referralString =
    channels && channels.length && referralSource !== referralCode
      ? lookupUrlByClaimName(referralSource, channels)
      : referralSource;

  const referral = `${URL}/$/invite/${referralString.replace('#', ':')}`;

  useEffect(() => {
    // resolve once, after we have channel list
    if (!hasResolved && !resolveStarted && channelCount) {
      setResolveStarted(true);
      resolveUris(uris.split(','));
    }
  }, [channelCount, resolveStarted, hasResolved, resolvingCount, uris]);

  useEffect(() => {
    // once resolving count is 0, we know we're done
    if (resolveStarted && !hasResolved && resolvingCount === 0) {
      setHasResolved(true);
    }
  }, [resolveStarted, hasResolved, resolvingCount]);

  useEffect(() => {
    // set default channel
    if (topChannel && hasResolved) {
      handleReferralChange(topChannel.name);
    }
  }, [topChannel, hasResolved]);

  function lookupUrlByClaimName(name, channels) {
    const claim = channels.find(channel => channel.name === name);
    return claim ? claim.canonical_url.replace('lbry://', '') : name;
  }

  return (
    <Card
      title={__('Invite a Friend')}
      subtitle={__('When your friends start using LBRY, the network gets stronger!')}
      actions={
        <React.Fragment>
          <Form onSubmit={handleSubmit}>
            <SelectChannel
              channel={referralSource}
              onChannelChange={channel => handleReferralChange(channel)}
              label={'Code or Channel'}
              injected={[referralCode]}
            />

            <CopyableText label={__('Or share this link with your friends')} copyable={referral} />
            <FormField
              type="text"
              label="Email"
              placeholder="youremail@example.org"
              name="email"
              value={email}
              error={errorMessage}
              inputButton={<Button button="secondary" type="submit" label="Invite" disabled={isPending || !email} />}
              onChange={event => {
                handleEmailChanged(event);
              }}
            />
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

export default InviteNew;
