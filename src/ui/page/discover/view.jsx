// @flow
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import TagsSelect from 'component/tagsSelect';
import Page from 'component/page';

type Props = {
  followedTags: Array<Tag>,
};

function DiscoverPage(props: Props) {
  const { followedTags } = props;
  return (
    <Page>
      <ClaimListDiscover
        personal
        tags={followedTags.map(tag => tag.name)}
        injectedItem={<TagsSelect showClose title={__('Make This Your Own')} />}
      />
    </Page>
  );
}

export default DiscoverPage;
