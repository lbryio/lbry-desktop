// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import TagsSelect from 'component/tagsSelect';
import Page from 'component/page';
import Button from 'component/button';

type Props = {
  followedTags: Array<Tag>,
  email: string,
};

function DiscoverPage(props: Props) {
  const { followedTags, email } = props;

  return (
    <Page>
      {(email || !IS_WEB) && <TagsSelect showClose title={__('Customize Your Homepage')} />}
      <ClaimListDiscover
        hideCustomization={IS_WEB && !email}
        personalView
        tags={followedTags.map(tag => tag.name)}
        meta={<Button button="link" label={__('Customize')} navigate={`/$/${PAGES.FOLLOWING}`} />}
      />
    </Page>
  );
}

export default DiscoverPage;
