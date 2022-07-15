// @flow
import React from 'react';
import { CollectionsListContext } from 'page/playlists/internal/collectionsListMine/view';

const FilteredTextLabel = () => {
  const { totalLength, searchText, filteredCollectionsLength } = React.useContext(CollectionsListContext);

  if (!searchText) return null;

  return (
    <div className="collection-grid__results-summary">
      {__(
        filteredCollectionsLength > 1
          ? 'Showing %filtered% results of %total%'
          : 'Showing %filtered% result of %total%',
        {
          filtered: filteredCollectionsLength,
          total: totalLength,
        }
      )}
      {`${' (' + __('filtered') + ') '}`}
    </div>
  );
};

export default FilteredTextLabel;
