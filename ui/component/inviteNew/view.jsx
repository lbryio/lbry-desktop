// @flow
import { URL, SITE_NAME } from 'config';
import React, { useEffect, useState } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';
import Card from 'component/common/card';
import analytics from 'analytics';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  errorMessage: ?string,
  inviteNew: (string) => void,
  isPending: boolean,
  referralCode: string,
  channels: ?Array<ChannelClaim>,
};

function InviteNew(props: Props) {
  const { inviteNew, errorMessage, isPending, referralCode = '', channels } = props;

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

  const handleReferralChange = React.useCallback(
    (code) => {
      setReferralSource(code);
      // TODO: keep track of this in an array?
      const matchingChannel = channels && channels.find((ch) => ch.name === code);
      if (matchingChannel) {
        analytics.apiLogPublish(matchingChannel);
      }
    },
    [setReferralSource]
  );

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
  }, [topChannel, handleReferralChange]);

  function lookupUrlByClaimName(name, channels) {
    const claim = channels.find((channel) => channel.name === name);
    return claim && claim.canonical_url ? claim.canonical_url.replace('lbry://', '') : name;
  }

  return (
    <div className={'columns'}>
      <div className="column">
        <Card
          title={__('Invites')}
          subtitle={
            <I18nMessage tokens={{ SITE_NAME, lbc: <LbcSymbol /> }}>
              Earn %lbc% for inviting subscribers, followers, fans, friends, etc. to join and follow you on %SITE_NAME%.
              You can use invites just like affiliate links.
            </I18nMessage>
          }
          actions={
            <React.Fragment>
              <CopyableText label={__('Your invite link')} copyable={referral} />
              {channels && channels.length > 0 && (
                <FormField
                  type="select"
                  label={__('Customize link')}
                  value={referralSource}
                  onChange={(e) => handleReferralChange(e.target.value)}
                >
                  {channels.map((channel) => (
                    <option key={channel.claim_id} value={channel.name}>
                      {channel.name}
                    </option>
                  ))}
                  <option value={referralCode}>{referralCode}</option>
                </FormField>
              )}
            </React.Fragment>
          }
        />
      </div>
      <div className="column">
        <Card
          title={__('Invite by email')}
          subtitle={
            <I18nMessage tokens={{ SITE_NAME, lbc: <LbcSymbol /> }}>
              Invite someone you know by email and earn %lbc% when they join %SITE_NAME%.
            </I18nMessage>
          }
          actions={
            <React.Fragment>
              <Form onSubmit={handleSubmit}>
                <FormField
                  type="text"
                  label={__('Email')}
                  placeholder="youremail@example.org"
                  name="email"
                  value={email}
                  error={errorMessage}
                  inputButton={
                    <Button button="secondary" type="submit" label={__('Invite')} disabled={isPending || !email} />
                  }
                  onChange={(event) => {
                    handleEmailChanged(event);
                  }}
                />
                <p className="help">
                  <I18nMessage
                    tokens={{
                      rewards_link: <Button button="link" navigate="/$/rewards" label={__('rewards')} />,
                      referral_faq_link: (
                        <Button
                          button="link"
                          label={__('FAQ')}
                          href="https://odysee.com/@OdyseeHelp:b/rewards-verification:3"
                        />
                      ),
                    }}
                  >
                    Read our %referral_faq_link% to learn more about rewards.
                  </I18nMessage>
                </p>
              </Form>
            </React.Fragment>
          }
        />
      </div>
    </div>
  );
}

export default InviteNew;
