// @flow
import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';
import ClaimList from 'component/claimList';

type Props = {
  subscribedChannels: Array<{ uri: string }>,
};

function DiscoverPage(props: Props) {
  const { subscribedChannels } = props;

  return (
    <Page>
      <div className="card">
        <TagsSelect showClose={false} title={__('Find New Tags To Follow')} />
      </div>
      <div className="card">
        <ClaimList
          header={<h1>{__('Channels You Are Following')}</h1>}
          empty={__("You aren't following any channels.")}
          uris={subscribedChannels.map(({ uri }) => uri)}
        />
      </div>
    </Page>
  );
}

export default DiscoverPage;
