// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import CollectionsListMine from 'component/collectionsListMine';
import Icon from 'component/common/icon';

function ListsPage() {
  return (
    <Page className="playlistPage-wrapper">
      <label className="claim-list__header-label">
        <span>
          <Icon icon={ICONS.STACK} size={10} />
          {__('Lists')}
        </span>
      </label>
      <CollectionsListMine />
    </Page>
  );
}

export default ListsPage;
