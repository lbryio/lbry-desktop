// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import ClaimList from 'component/claimList';
import Page from 'component/page';
import Button from 'component/button';
import Icon from 'component/common/icon';

import { TYPE_NEW } from 'component/claimListDiscover/view';

type Props = {
  email: string,
  subscribedChannels: Array<Subscription>,
  doFetchRecommendedSubscriptions: () => void,
  suggestedSubscriptions: Array<{ uri: string }>,
};

function ChannelsFollowing(props: Props) {
  const { subscribedChannels, suggestedSubscriptions, doFetchRecommendedSubscriptions } = props;
  const hasSubsribedChannels = subscribedChannels.length > 0;
  const [showTab, setShowTab] = React.useState(!hasSubsribedChannels);

  React.useEffect(() => {
    if (!hasSubsribedChannels) {
      doFetchRecommendedSubscriptions();
    }
  }, [doFetchRecommendedSubscriptions, hasSubsribedChannels]);

  return (
    <Page>
      {showTab ? (
        <ClaimList
          header={__('Find Channels to Follow')}
          headerAltControls={
            <Button
              button="link"
              label={hasSubsribedChannels && __('View Your Feed')}
              onClick={() => setShowTab(false)}
            />
          }
          uris={suggestedSubscriptions.map(sub => `lbry://${sub.uri}`)}
        />
      ) : (
        <ClaimListDiscover
          headerLabel={
            <span>
              <Icon icon={ICONS.SUBSCRIBE} size={10} />
              {__('Following')}
            </span>
          }
          defaultTypeSort={TYPE_NEW}
          channelIds={subscribedChannels.map(sub => sub.uri.split('#')[1])}
          meta={
            <Button
              icon={ICONS.EDIT}
              button="link"
              label={__('Manage')}
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_MANAGE}`}
            />
          }
        />
      )}
    </Page>
  );
}

export default ChannelsFollowing;
