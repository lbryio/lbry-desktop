// @flow
import React, { useEffect } from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import Nag from 'component/common/nag';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import Card from 'component/common/card';
import { AUTO_FOLLOW_CHANNELS } from 'config';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
  onBack: () => void,
  channelSubscribe: (sub: Subscription) => void,
};

const channelsToSubscribe = AUTO_FOLLOW_CHANNELS.trim().split(' ');

function UserChannelFollowIntro(props: Props) {
  const { subscribedChannels, channelSubscribe, onContinue, onBack } = props;
  const followingCount = (subscribedChannels && subscribedChannels.length) || 0;

  // subscribe to lbry
  useEffect(() => {
    channelsToSubscribe.forEach(c =>
      channelSubscribe({
        channelName: parseURI(c).claimName,
        uri: c,
      })
    );
  }, []);

  return (
    <Card
      title={__('Find Channels to Follow')}
      subtitle={__(
        'LBRY works better if you find and follow at least 5 creators you like. You can also block channels you never want to see.'
      )}
      actions={
        <React.Fragment>
          <div className="section__actions">
            <Button button="secondary" onClick={onBack} label={__('Back')} />
            <Button
              button="primary"
              type="Submit"
              onClick={onContinue}
              label={__('Continue')}
              disabled={subscribedChannels.length < 2}
            />
          </div>
          <div className="section__body">
            <ClaimListDiscover
              defaultOrderBy={CS.ORDER_BY_TOP}
              defaultFreshness={CS.FRESH_ALL}
              claimType="channel"
              defaultTags={CS.TAGS_FOLLOWED}
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
