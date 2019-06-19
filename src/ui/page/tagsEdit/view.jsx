// @flow
import React from 'react';
import Page from 'component/page';
import TagsSelect from 'component/tagsSelect';

type Props = {};

function DiscoverPage(props: Props) {
  return (
    <Page>
      <div className="card">
        <TagsSelect showClose={false} title={__('Find New Tags To Follow')} />
      </div>
    </Page>
  );
}

export default DiscoverPage;
