// @flow
import React, { useEffect, useState } from 'react';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import CopyableText from 'component/copyableText';
import Card from 'component/common/card';
import { URL } from 'config';
import SelectChannel from 'component/selectChannel';
import I18nMessage from 'component/i18nMessage';

type Props = {
  errorMessage: ?string,
  inviteNew: string => void,
  isPending: boolean,
  referralLink: string,
  referralCode: string,
  channels: any,
  fetchChannelListMine: () => void,
  fetchingChannels: boolean,
};

function InviteNew(props: Props) {
  const { inviteNew, fetchChannelListMine, errorMessage, isPending, referralCode, channels } = props;
  const [email, setEmail] = useState('');
  const [referralSource, setReferralSource] = useState(referralCode);

  const topChannel =
    channels &&
    channels.reduce((top, channel) =>
      (top && top.meta && top.meta.claims_in_channel) > channel.meta.claims_in_channel ? top : channel
    );
  const referralString =
    channels && channels.length && referralSource !== referralCode
      ? getUrlFromName(referralSource, channels)
      : referralSource;
  const referral = `${URL}/$/invite/${referralString}`;

  useEffect(() => {
    // check emailverified and is_web?
    fetchChannelListMine();
  }, []);

  useEffect(() => {
    if (topChannel) {
      setReferralSource(topChannel.name);
    }
  }, [topChannel]);

  function handleEmailChanged(event: any) {
    setEmail(event.target.value);
  }

  function handleSubmit() {
    inviteNew(email);
  }

  function getUrlFromName(name, channels) {
    const claim = channels.find(channel => channel.name === name);
    return claim ? claim.permanent_url.replace('lbry://', '') : name;
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
              onChannelChange={channel => setReferralSource(channel)}
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
