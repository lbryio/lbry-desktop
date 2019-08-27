// @flow
import React from 'react';
import UserSignIn from 'component/userSignIn';
import UserFirstChannel from 'component/userFirstChannel';
import UserVerify from 'component/userVerify';
import Page from 'component/page';

type Props = {
  user: ?User,
  channels: ?Array<ChannelClaim>,
  location: { search: string },
  history: { replace: string => void },
};

export default function SignInPage(props: Props) {
  const { user, channels, location, history } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const hasVerifiedEmail = user && user.has_verified_email;
  const rewardsApproved = user && user.is_reward_approved;
  const channelCount = channels ? channels.length : 0;
  const showWelcome = !hasVerifiedEmail || channelCount === 0;

  if (rewardsApproved && channelCount > 0) {
    history.replace(redirect ? `/$/${redirect}` : '/');
  }

  return (
    <Page fullscreen className="main--auth-page">
      {showWelcome && (
        <div className="columns">
          {!hasVerifiedEmail && <UserSignIn />}
          {hasVerifiedEmail && channelCount === 0 && <UserFirstChannel />}
          <div style={{ width: '100%', height: '20rem', borderRadius: 20, backgroundColor: '#ffc7e6' }} />
        </div>
      )}

      {hasVerifiedEmail && channelCount > 0 && <UserVerify />}
    </Page>
  );
}
