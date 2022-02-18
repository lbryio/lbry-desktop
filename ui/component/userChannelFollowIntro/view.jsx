// @flow
import { CUSTOM_HOMEPAGE, SIMPLE_SITE, SITE_NAME } from 'config';
import { parseURI } from 'util/lbryURI';
import * as CS from 'constants/claim_search';
import COMMUNITY_CHANNELS from 'constants/community_channels';
import Button from 'component/button';
import Card from 'component/common/card';
import ClaimListDiscover from 'component/claimListDiscover';
import Nag from 'component/common/nag';
import React from 'react';

type Props = {
  homepageData: any,
  language: string,
  prefsReady: boolean,
  subscribedChannels: Array<Subscription>,
  channelSubscribe: (string, string) => void,
  onContinue: () => void,
};

function UserChannelFollowIntro(props: Props) {
  const { homepageData, language, prefsReady, subscribedChannels, channelSubscribe, onContinue } = props;

  const { PRIMARY_CONTENT, LATEST } = homepageData;

  const autoFollowChannels = COMMUNITY_CHANNELS[language] || COMMUNITY_CHANNELS['en'];

  const channelsToSubscribe = autoFollowChannels
    .trim()
    .split(' ')
    .filter((x) => x !== '');

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

  // subscribe to odysee channels
  React.useEffect(() => {
    if (channelsToSubscribe && channelsToSubscribe.length && prefsReady) {
      const delayedChannelSubscribe = () => {
        channelsToSubscribe.forEach((channelUri) => {
          let claimName;
          try {
            const { claimName: name } = parseURI(channelUri);
            claimName = name;
          } catch (e) {}

          if (claimName) channelSubscribe(claimName, channelUri);
        });
      };
      setTimeout(delayedChannelSubscribe, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsReady]);

  return (
    <Card
      className="channelsToFollow-wrapper"
      title={__('Find channels to follow')}
      subtitle={__(
        '%SITE_NAME% works better if you find and follow a couple creators you like. You can also block channels you never want to see.',
        { SITE_NAME }
      )}
      actions={
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
            claimIds={(CUSTOM_HOMEPAGE && channelIds) || undefined}
            defaultTags={followingCount > 3 ? CS.TAGS_FOLLOWED : undefined}
            maxPages={SIMPLE_SITE ? 3 : undefined}
          />

          {followingCountIgnoringAutoFollows > 0 && (
            <Nag
              type="helpful"
              message={__(
                followingCountIgnoringAutoFollows === 1
                  ? 'Nice! You are currently following %followingCount% creator'
                  : 'Nice! You are currently following %followingCount% creators',
                {
                  followingCount: followingCountIgnoringAutoFollows,
                }
              )}
              actionText={__('Continue')}
              onClick={onContinue}
            />
          )}
        </div>
      }
    />
  );
}

export default UserChannelFollowIntro;
