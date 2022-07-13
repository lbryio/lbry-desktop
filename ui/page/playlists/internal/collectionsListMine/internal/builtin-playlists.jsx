// @flow
import React from 'react';
import classnames from 'classnames';
import * as COLS from 'constants/collections';
import CollectionPreview from './collectionPreview';
import SectionLabel from './label';
import TableHeader from './table-header';
import { useIsMobile } from 'effects/use-screensize';

const BuiltinPlaylists = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <SectionLabel label={__('Default Playlists')} />

      {!isMobile && <TableHeader />}

      <ul className={classnames('ul--no-style claim-list', { playlists: !isMobile })}>
        {COLS.BUILTIN_PLAYLISTS.map((playlist) => (
          <CollectionPreview collectionId={playlist} key={playlist} />
        ))}
      </ul>
    </>
  );
};

export default BuiltinPlaylists;
