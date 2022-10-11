// @flow
import { SITE_NAME } from 'config';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import { buildURI, parseURI } from 'util/lbryURI';
import { ERRORS } from 'lbryinc';
import { formatLbryUrlForWeb } from 'util/url';
import ChannelContent from 'component/channelContent';
import I18nMessage from 'component/i18nMessage';
import Spinner from 'component/spinner';

type Props = {
  userHasVerifiedEmail: ?boolean,
  doClaimRefereeReward: () => void,
  doUserSetReferrerForUri: (referrerUri: string) => void,
  referrerSet: ?string,
  referrerSetError: string,
  doChannelSubscribe: (sub: Subscription) => void,
  history: { push: (string) => void },
  hasUnclaimedRefereeReward: boolean,
  referrerUri: ?string,
  isSubscribed: boolean,
  channelTitle: string,
};

function Invited(props: Props) {
  const {
    userHasVerifiedEmail,
    doClaimRefereeReward,
    doUserSetReferrerForUri,
    referrerSet,
    referrerSetError,
    doChannelSubscribe,
    history,
    hasUnclaimedRefereeReward,
    referrerUri,
    isSubscribed,
    channelTitle,
  } = props;

  const {
    isChannel: referrerIsChannel,
    channelName: referrerChannelName,
    channelClaimId: referrerChannelClaimId,
    streamName: referrerStreamName,
    streamClaimId: referrerStreamClaimId,
  } = referrerUri ? parseURI(referrerUri) : {};

  const redirectPath =
    formatLbryUrlForWeb(
      buildURI({
        channelName: referrerChannelName,
        channelClaimId: referrerChannelClaimId,
        streamName: referrerStreamName,
        streamClaimId: referrerStreamClaimId,
      })
    ) || '/';

  function handleDone() {
    history.push(redirectPath);
  }

  // always follow if it's a channel
  React.useEffect(() => {
    if (referrerIsChannel && !isSubscribed && userHasVerifiedEmail && referrerUri) {
      let channelName;
      try {
        const { claimName } = parseURI(referrerUri);
        channelName = claimName;
      } catch (e) {}
      if (channelName) {
        doChannelSubscribe({
          channelName: channelName,
          uri: referrerUri,
        });
      }
    }
  }, [referrerUri, isSubscribed, doChannelSubscribe, userHasVerifiedEmail, referrerIsChannel]);

  React.useEffect(() => {
    if (referrerSet === undefined && userHasVerifiedEmail) {
      doClaimRefereeReward();
    }
  }, [doClaimRefereeReward, userHasVerifiedEmail, referrerSet]);

  React.useEffect(() => {
    if (referrerSet === undefined && referrerUri) {
      doUserSetReferrerForUri(referrerUri);
    }
  }, [referrerUri, doUserSetReferrerForUri, referrerSet]);

  const cardProps = React.useMemo(() => ({ body: <ClaimPreview uri={referrerUri} type="small" /> }), [referrerUri]);
  const cardChildren = React.useMemo(
    () =>
      referrerIsChannel && (
        <div className="claim-preview--channel">
          <div className="section">
            <ChannelContent uri={referrerUri} defaultPageSize={3} defaultInfiniteScroll={false} />
          </div>
        </div>
      ),
    [referrerIsChannel, referrerUri]
  );

  // Case 1: Loading
  if (referrerSet === undefined && referrerUri) {
    return (
      <div className="main--empty">
        <Spinner />
      </div>
    );
  }

  // Case 2: Already claimed reward
  if (referrerSetError === ERRORS.ALREADY_CLAIMED) {
    return (
      <Card
        {...cardProps}
        title={__('Whoa!')}
        subtitle={
          referrerIsChannel
            ? __("You've already claimed your referrer, but we've followed this channel for you.")
            : __('You already claimed your reward.')
        }
        actions={<Button button="primary" label={__('Done!')} onClick={handleDone} />}
      >
        {cardChildren}
      </Card>
    );
  }

  // Case 3: No reward to claim (referrer claim is null/deleted, or invite is invalid)
  if (!referrerSet || (referrerSetError && hasUnclaimedRefereeReward)) {
    return (
      <Card
        {...cardProps}
        title={__('Welcome!')}
        subtitle={__(
          'Something went wrong with your invite link. You can set and claim your invite reward after signing in.'
        )}
        actions={
          <>
            <p className="error__text">{__('Not a valid invite')}</p>

            <div className="section__actions">
              <Button
                button="primary"
                label={userHasVerifiedEmail ? __('Verify') : __('Sign up')}
                navigate={
                  userHasVerifiedEmail ? `/$/${PAGES.REWARDS_VERIFY}` : `/$/${PAGES.AUTH}?redirect=/$/${PAGES.REWARDS}`
                }
              />
              <Button button="link" label={__('Explore')} onClick={handleDone} />
            </div>
          </>
        }
      >
        {cardChildren}
      </Card>
    );
  }

  const SignUpButton = (buttonProps: any) => (
    <Button
      button="link"
      label={userHasVerifiedEmail ? __('Finish verification') : __('Sign up')}
      navigate={
        userHasVerifiedEmail
          ? `/$/${PAGES.REWARDS_VERIFY}?redirect=/$/${PAGES.INVITE}${redirectPath}`
          : `/$/${PAGES.AUTH}?redirect=/$/${PAGES.INVITE}${redirectPath}`
      }
      {...buttonProps}
    />
  );

  // Case 4: Reward can be claimed
  return (
    <Card
      {...cardProps}
      title={
        referrerIsChannel
          ? __('%channel_name% invites you to the party!', { channel_name: channelTitle })
          : __("You're invited!")
      }
      subtitle={
        referrerIsChannel ? (
          <I18nMessage tokens={{ channel_name: channelTitle, signup_link: <SignUpButton />, site_name: SITE_NAME }}>
            %channel_name% is waiting for you on %site_name%. %signup_link% to claim it.
          </I18nMessage>
        ) : (
          <I18nMessage tokens={{ signup_link: <SignUpButton /> }}>
            Content freedom and a present are waiting for you. %signup_link% to claim it.
          </I18nMessage>
        )
      }
      actions={
        <div className="section__actions">
          <SignUpButton button="primary" />
          <Button button="link" label={__('Skip')} onClick={handleDone} />
        </div>
      }
    >
      {cardChildren}
    </Card>
  );
}

export default Invited;
