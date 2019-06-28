// @flow
import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';
import ClaimList from 'component/claimList';

type Props = {
  subscribedChannels: Array<Subscription>,
};

function FollowingEditPage(props: Props) {
  const { subscribedChannels } = props;
  const channelUris = subscribedChannels.map(({ uri }) => uri);
  return (
    <Page>
      <div className="card">
        <TagsSelect showClose={false} title={__('Customize Your Tags')} />
      </div>
      <div className="card">
        <ClaimList header={<h1>{__('Channels You Follow')}</h1>} uris={channelUris} />
      </div>
    </Page>
  );
}

export default FollowingEditPage;
