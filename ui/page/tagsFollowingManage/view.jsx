// @flow
import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';

function FollowingPage() {
  return (
    <Page>
      <TagsSelect showClose={false} title={__('Follow New Tags')} />
    </Page>
  );
}

export default FollowingPage;
