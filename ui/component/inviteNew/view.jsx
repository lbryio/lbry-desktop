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
  channels: ?Array<ChannelClaim>,
};

function InviteNew(props: Props) {
  const { inviteNew, errorMessage, isPending, referralCode = '', channels } = props;
  const rewardAmount = 20;

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

  function handleReferralChange(code) {
    setReferralSource(code);
    // TODO: keep track of this in an array?
    const matchingChannel = channels && channels.find(ch => ch.name === code);
    if (matchingChannel) {
      analytics.apiLogPublish(matchingChannel);
    }
  }

  const topChannel =
    channels &&
    channels.reduce((top, channel) => {
      const topClaimCount = (top && top.meta && top.meta.claims_in_channel) || 0;
      const currentClaimCount = (channel && channel.meta && channel.meta.claims_in_channel) || 0;
      return topClaimCount >= currentClaimCount ? top : channel;
    });
  const referralString =
    channels && channels.length && referralSource !== referralCode
      ? lookupUrlByClaimName(referralSource, channels)
      : referralSource;

  const referral = `${URL}/$/invite/${referralString.replace('#', ':')}`;

  useEffect(() => {
    // set default channel
    if (topChannel) {
      handleReferralChange(topChannel.name);
    }
  }, [topChannel]);

  function lookupUrlByClaimName(name, channels) {
    const claim = channels.find(channel => channel.name === name);
    return claim && claim.canonical_url ? claim.canonical_url.replace('lbry://', '') : name;
  }

  return (
    <div className={'columns'}>
      <Card
        title={__('Invite Link')}
        subtitle={__('Share this link with friends (or enemies) and get %reward_amount% LBC when they join lbry.tv', {
          reward_amount: rewardAmount,
        })}
        actions={
          <React.Fragment>
            <CopyableText label={__('Your invite link')} copyable={referral} />
            <SelectChannel
              channel={referralSource}
              onChannelChange={channel => handleReferralChange(channel)}
              label={'Customize link'}
              hideAnon
              injected={[referralCode]}
            />

            <p className="help">
              <I18nMessage
                tokens={{
                  rewards_link: <Button button="link" navigate="/$/rewards" label={__('rewards')} />,
                  referral_faq_link: <Button button="link" label={__('FAQ')} href="https://lbry.com/faq/referrals" />,
                }}
              >
                Earn %rewards_link% for inviting your friends. Read our %referral_faq_link% to learn more.
              </I18nMessage>
            </p>
          </React.Fragment>
        }
      />

      <Card
        title={__('Invite by Email')}
        subtitle={__('Invite someone you know by email and earn %reward_amount% LBC when they join lbry.tv.', {
          reward_amount: rewardAmount,
        })}
        actions={
          <React.Fragment>
            <Form onSubmit={handleSubmit}>
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
                  Earn %rewards_link% for inviting your friends. Read our %referral_faq_link% to learn more.
                </I18nMessage>
              </p>
            </Form>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default InviteNew;
