// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Page from 'component/page';
import PlaylistsMine from 'component/playlistsMine';
import Icon from 'component/common/icon';

function PlaylistsPage() {
  return (
    <Page>
      <label className="claim-list__header-label">
        <span>
          <Icon icon={ICONS.STACK} size={10} />
          {__('Playlists')}
        </span>
      </label>
      <PlaylistsMine />
    </Page>
  );
}

export default PlaylistsPage;
