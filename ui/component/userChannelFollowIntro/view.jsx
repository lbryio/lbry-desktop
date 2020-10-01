// @flow
import React, { useEffect } from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import Nag from 'component/common/nag';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import Card from 'component/common/card';
import { AUTO_FOLLOW_CHANNELS } from 'config';
import { PRIMARY_CONTENT_CHANNEL_IDS } from 'homepage';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
  channelSubscribe: (sub: Subscription) => void,
};

const channelsToSubscribe = AUTO_FOLLOW_CHANNELS.trim()
  .split(' ')
  .filter(x => x !== '');

function UserChannelFollowIntro(props: Props) {
  const { subscribedChannels, channelSubscribe, onContinue } = props;
  const followingCount = (subscribedChannels && subscribedChannels.length) || 0;

  // subscribe to lbry
  useEffect(() => {
    if (channelsToSubscribe && channelsToSubscribe.length) {
      channelsToSubscribe.forEach(c =>
        channelSubscribe({
          channelName: parseURI(c).claimName,
          uri: c,
        })
      );
    }
  }, []);

  return (
    <Card
      title={__('Find channels to follow')}
      subtitle={__(
        'Odysee works better if you find and follow a couple creators you like. You can also block channels you never want to see.'
      )}
      actions={
        <React.Fragment>
          <div className="section__body">
            <ClaimListDiscover
              hideFilters
              meta={
                <Button
                  button={subscribedChannels.length < 1 ? 'alt' : 'primary'}
                  onClick={onContinue}
                  label={subscribedChannels.length < 1 ? __('Skip') : __('Continue')}
                />
              }
              defaultOrderBy={CS.ORDER_BY_TRENDING}
              defaultFreshness={CS.FRESH_ALL}
              claimType={CS.CLAIM_CHANNEL}
              claimIds={PRIMARY_CONTENT_CHANNEL_IDS}
              maxPages={3}
            />
            {followingCount > 0 && (
              <Nag
                type="helpful"
                message={
                  followingCount === 1
                    ? __('Nice! You are currently following %followingCount% creator', { followingCount })
                    : __('Nice! You are currently following %followingCount% creators', { followingCount })
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
