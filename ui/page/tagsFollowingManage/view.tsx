import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';

function FollowingPage() {
  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page>
      {/* @ts-expect-error - TS2322, TS2741 (ts-migration) */}
      <TagsSelect limitShow={300} showClose={false} title={__('Follow new tags')} />
    </Page>
  );
}

export default FollowingPage;
