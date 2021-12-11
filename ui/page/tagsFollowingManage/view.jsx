// @flow
import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';

function FollowingPage() {
  return (
    <Page>
      <TagsSelect limitShow={300} showClose={false} title={__('Follow new tags')} />
    </Page>
  );
}

export default FollowingPage;
