// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { parseURI } from 'lbry-redux';
import { rewards as REWARDS, ERRORS } from 'lbryinc';

type Props = {
  user: any,
  claimReward: () => void,
  setReferrer: string => void,
  referrerSetPending: boolean,
  referrerSetError: string,
  channelSubscribe: (sub: Subscription) => void,
  history: { push: string => void },
  rewards: Array<Reward>,
  referrer: string,
  fullUri: string,
  isSubscribed: boolean,
};

function Invited(props: Props) {
  const {
    user,
    claimReward,
    setReferrer,
    referrerSetPending,
    referrerSetError,
    channelSubscribe,
    history,
    rewards,
    fullUri,
    referrer,
    isSubscribed,
  } = props;

  const refUri = referrer && 'lbry://' + referrer.replace(':', '#');
  const referrerIsChannel = parseURI(refUri).isChannel;
  const rewardsApproved = user && user.is_reward_approved;
  const hasVerifiedEmail = user && user.has_verified_email;
  const referredRewardAvailable = rewards && rewards.some(reward => reward.reward_type === REWARDS.TYPE_REFEREE);

  // always follow if it's a channel
  useEffect(() => {
    if (fullUri && !isSubscribed) {
      channelSubscribe({
        channelName: parseURI(fullUri).claimName,
        uri: fullUri,
      });
    }
  }, [fullUri, isSubscribed]);

  useEffect(() => {
    if (!referrerSetPending && hasVerifiedEmail) {
      claimReward();
    }
  }, [referrerSetPending, hasVerifiedEmail]);

  useEffect(() => {
    if (referrer) {
      setReferrer(referrer.replace(':', '#'));
    }
  }, [referrer]);

  function handleDone() {
    history.push(`/$/${PAGES.DISCOVER}`);
  }

  if (referrerSetError === ERRORS.ALREADY_CLAIMED) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={referrerIsChannel ? __(`We've followed your referrer for you. Check it out!`) : __(`Congrats!`)}
        actions={
          <>
            {referrerIsChannel && (
              <div key={refUri} className="claim-preview--channel">
                <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
              </div>
            )}
            <div className="card__actions">
              <Button button="primary" label={__('Done!')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  if (referrerSetError && referredRewardAvailable) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={__(
          `Something went wrong with your referral link. You can set and claim your referral reward after signing in.`
        )}
        actions={
          <>
            <p className="error-text">{__('Not a valid referral')}</p>
            <div className="card__actions">
              <Button
                button="primary"
                label={hasVerifiedEmail ? __('Verify') : __('Sign in')}
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`}
              />
              <Button button="primary" label={__('Explore')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  if (!rewardsApproved) {
    return (
      <Card
        title={__(`You're invited!`)}
        subtitle={__(`A referral reward is waiting for you. Just complete sign-in to claim it.`)}
        actions={
          <>
            {referrerIsChannel && (
              <div key={refUri} className="claim-preview--channel">
                <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
              </div>
            )}
            <div className="card__actions">
              <Button
                button="primary"
                label={hasVerifiedEmail ? __('Verify') : __('Sign in')}
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.INVITE}/${referrer}`}
              />
              <Button button="primary" label={__('Skip')} onClick={handleDone} />
            </div>
          </>
        }
      />
    );
  }

  return (
    <Card
      title={__(`Welcome!`)}
      subtitle={referrerIsChannel ? __(`We've followed your referrer for you. Check it out!`) : __(`Congrats!`)}
      actions={
        <>
          {referrerIsChannel && (
            <div key={refUri} className="claim-preview--channel">
              <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
            </div>
          )}
          <div className="card__actions">
            <Button button="primary" label={__('Done!')} onClick={handleDone} />
          </div>
        </>
      }
    />
  );
}

export default Invited;
