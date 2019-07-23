// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import TagsSelect from 'component/tagsSelect';
import Page from 'component/page';
import Button from 'component/button';

type Props = {
  followedTags: Array<Tag>,
};

function DiscoverPage(props: Props) {
  const { followedTags } = props;

  return (
    <Page>
      <ClaimListDiscover
        personalView
        tags={followedTags.map(tag => tag.name)}
        meta={<Button button="link" label={__('Customize')} navigate={`/$/${PAGES.FOLLOWING}`} />}
        injectedItem={
          <TagsSelect showClose title={__('Customize Your Homepage')} className="claim-preview--injected" />
        }
      />
    </Page>
  );
}

export default DiscoverPage;
