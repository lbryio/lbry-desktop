// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { parseURI } from 'lbry-redux';

type Props = {
  user: any,
  fetchUser: () => void,
  claimReward: () => void,
  setReferrer: string => void,
  setReferrerPending: boolean,
  setReferrerError: string,
  channelSubscribe: (sub: Subscription) => void,
  history: { push: string => void },
};

function Invited(props: Props) {
  const {
    user,
    fetchUser,
    claimReward,
    setReferrer,
    setReferrerPending,
    setReferrerError,
    channelSubscribe,
    history,
  } = props;

  // useParams requires react-router-dom ^v5.1.0
  const { referrer } = useParams();
  const refUri = 'lbry://' + referrer.replace(':', '#');
  const referrerIsChannel = parseURI(refUri).isChannel;
  const rewardsApproved = user && user.is_reward_approved;
  const hasVerifiedEmail = user && user.has_verified_email;

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!setReferrerPending && hasVerifiedEmail) {
      claimReward();
    }
  }, [setReferrerPending, hasVerifiedEmail]);

  useEffect(() => {
    if (referrer) {
      setReferrer(referrer.replace(':', '#'));
    }
  }, [referrer]);

  function handleDone() {
    if (hasVerifiedEmail && referrerIsChannel) {
      channelSubscribe({
        channelName: parseURI(refUri).claimName,
        uri: refUri,
      });
    }
    history.push(`/$/${PAGES.DISCOVER}`);
  }

  if (setReferrerError) {
    return (
      <Card
        title={__(`Welcome!`)}
        subtitle={__(
          `Something went wrong with this referral link. Take a look around. You can get earn rewards by setting your referrer later.`
        )}
        actions={
          <>
            <p className="error-text">{__('Not a valid referral')}</p>
            <p className="error-text">{setReferrerError}</p>
            <div className="card__actions">
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
      subtitle={__(`You can visit your referrer, or discover new stuff.`)}
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
