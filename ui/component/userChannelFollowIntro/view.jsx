// @flow
import React, { useEffect } from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import Nag from 'component/common/nag';
import { parseURI } from 'util/lbryURI';
import Button from 'component/button';
import Card from 'component/common/card';
import { AUTO_FOLLOW_CHANNELS, CUSTOM_HOMEPAGE, SIMPLE_SITE, SITE_NAME } from 'config';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
  channelSubscribe: (sub: Subscription) => void,
  homepageData: any,
  prefsReady: boolean,
};

const channelsToSubscribe = AUTO_FOLLOW_CHANNELS.trim()
  .split(' ')
  .filter((x) => x !== '');

function UserChannelFollowIntro(props: Props) {
  const { subscribedChannels, channelSubscribe, onContinue, homepageData, prefsReady } = props;
  const { PRIMARY_CONTENT, LATEST } = homepageData;
  let channelIds;
  if (CUSTOM_HOMEPAGE) {
    if (LATEST) {
      channelIds = LATEST.channelIds;
    } else if (PRIMARY_CONTENT) {
      channelIds = PRIMARY_CONTENT.channelIds;
    }
  }
  const followingCount = (subscribedChannels && subscribedChannels.length) || 0;
  const followingCountIgnoringAutoFollows = (subscribedChannels || []).filter(
    (channel) => !channelsToSubscribe.includes(channel.uri)
  ).length;

  // subscribe to lbry
  useEffect(() => {
    if (channelsToSubscribe && channelsToSubscribe.length && prefsReady) {
      const delayedChannelSubscribe = () => {
        channelsToSubscribe.forEach((c) =>
          channelSubscribe({
            channelName: parseURI(c).claimName,
            uri: c,
          })
        );
      };
      setTimeout(delayedChannelSubscribe, 1000);
    }
  }, [prefsReady]);

  return (
    <Card
      title={__('Find channels to follow')}
      subtitle={__(
        '%SITE_NAME% works better if you find and follow a couple creators you like. You can also block channels you never want to see.',
        { SITE_NAME }
      )}
      actions={
        <React.Fragment>
          <div className="section__body">
            <ClaimListDiscover
              hideFilters={SIMPLE_SITE}
              hideAdvancedFilter={SIMPLE_SITE}
              meta={
                <Button
                  button={subscribedChannels.length < 1 ? 'alt' : 'primary'}
                  onClick={onContinue}
                  label={subscribedChannels.length < 1 ? __('Skip') : __('Continue')}
                />
              }
              defaultOrderBy={SIMPLE_SITE ? CS.ORDER_BY_TOP : CS.ORDER_BY_TRENDING}
              defaultFreshness={CS.FRESH_ALL}
              claimType="channel"
              claimIds={CUSTOM_HOMEPAGE && channelIds ? channelIds : undefined}
              defaultTags={followingCount > 3 ? CS.TAGS_FOLLOWED : undefined}
              maxPages={SIMPLE_SITE ? 3 : undefined}
            />
            {followingCount > 0 && (
              <Nag
                type="helpful"
                message={
                  followingCountIgnoringAutoFollows === 1
                    ? __('Nice! You are currently following %followingCount% creator', {
                        followingCount: followingCountIgnoringAutoFollows,
                      })
                    : __('Nice! You are currently following %followingCount% creators', {
                        followingCount: followingCountIgnoringAutoFollows,
                      })
                }
                actionText={__('Continue')}
                onClick={onContinue}
              />
            )}
          </div>
        </React.Fragment>
      }
    />
  );
}

export default UserChannelFollowIntro;
