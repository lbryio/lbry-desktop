// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { buildURI, parseURI } from 'lbry-redux';
import { rewards as REWARDS, ERRORS } from 'lbryinc';
import { formatLbryUrlForWeb } from 'util/url';

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
  const {
    isChannel: referrerIsChannel,
    claimName: referrerChannelName,
    channelClaimId: referrerChannelClaimId,
  } = parseURI(refUri);
  const channelUri =
    referrerIsChannel &&
    formatLbryUrlForWeb(buildURI({ channelName: referrerChannelName, channelClaimId: referrerChannelClaimId }));
  const rewardsApproved = user && user.is_reward_approved;
  const hasVerifiedEmail = user && user.has_verified_email;
  const referredRewardAvailable = rewards && rewards.some(reward => reward.reward_type === REWARDS.TYPE_REFEREE);
  const redirect = channelUri || `/`;

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
    history.push(redirect);
  }

  if (referrerSetError === ERRORS.ALREADY_CLAIMED) {
    return (
      <Card
        title={__(`Whoa`)}
        subtitle={
          referrerIsChannel
            ? __(`You've already claimed your referrer, but we've followed this channel for you.`)
            : __(`You've already claimed your referrer.`)
        }
        body={
          referrerIsChannel && (
            <div className="claim-preview--channel">
              <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
            </div>
          )
        }
        actions={
          <div className="card__actions">
            <Button button="primary" label={__('Done!')} onClick={handleDone} />
          </div>
        }
      />
    );
  }

  if (referrerSetError && referredRewardAvailable) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={__(
          `Something went wrong with your invite link. You can set and claim your invite reward after signing in.`
        )}
        actions={
          <>
            <p className="error__text">{__('Not a valid invite')}</p>
            <div className="card__actions">
              <Button
                button="primary"
                label={hasVerifiedEmail ? __('Verify') : __('Create Account')}
                navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`}
              />
              <Button button="link" label={__('Explore')} onClick={handleDone} />
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
        subtitle={
          referrerIsChannel
            ? __(
                `Content freedom and a present from %channel_name% are waiting for you. Create an account to claim it.`,
                { channel_name: referrerChannelName }
              )
            : __(`Content freedom and a present are waiting for you. Create an account to claim it.`)
        }
        body={
          referrerIsChannel && (
            <div className="claim-preview--channel">
              <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
            </div>
          )
        }
        actions={
          <div className="card__actions">
            <Button
              button="primary"
              label={hasVerifiedEmail ? __('Finish Account') : __('Create Account')}
              navigate={`/$/${PAGES.AUTH}?redirect=/$/${PAGES.INVITE}/${referrer}`}
            />
            <Button button="link" label={__('Skip')} onClick={handleDone} />
          </div>
        }
      />
    );
  }

  return (
    <Card
      title={__(`Welcome!`)}
      subtitle={referrerIsChannel ? __(`We've followed your invitee for you. Check them out!`) : __(`Congrats!`)}
      body={
        referrerIsChannel && (
          <div className="claim-preview--channel">
            <ClaimPreview key={refUri} uri={refUri} actions={''} type={'small'} />
          </div>
        )
      }
      actions={
        <div className="card__actions">
          <Button button="primary" label={__('Done')} onClick={handleDone} />
        </div>
      }
    />
  );
}

export default Invited;
