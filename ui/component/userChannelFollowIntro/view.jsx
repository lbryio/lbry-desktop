// @flow
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import { TYPE_TOP, TIME_ALL } from 'component/claimListDiscover/view';
import Nag from 'component/common/nag';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
};

function UserChannelFollowIntro(props: Props) {
  const { subscribedChannels, onContinue } = props;
  const followingCount = (subscribedChannels && subscribedChannels.length) || 0;

  return (
    <React.Fragment>
      <h1 className="section__title--large">{__('Find Channels to Follow')}</h1>
      <p className="section__subtitle">
        {__(
          'LBRY works better if you find and follow at least 5 creators you like. You can also block channels you never want to see.'
        )}
      </p>
      <div className="section__body">
        <ClaimListDiscover defaultTypeSort={TYPE_TOP} defaultTimeSort={TIME_ALL} claimType="channel" hideBlock />
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
  );
}

export default UserChannelFollowIntro;
