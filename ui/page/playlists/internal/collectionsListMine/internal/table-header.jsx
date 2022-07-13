// @flow
import React from 'react';

const TableHeader = () => (
  <table className="table table--playlists">
    <thead>
      <tr>
        <th className="table-column__playlist">{__('Playlist')}</th>
        <th className="table-column__meta">
          <label>{__('Meta')}</label>
          <th className="table-column__visibility">{__('Visibility')}</th>
          <th className="table-column__create-at">{__('Created at')}</th>
          <th className="table-column__update-at">{__('Last updated at')}</th>
        </th>
        <th className="table-column__action">{__('Play')}</th>
      </tr>
    </thead>
  </table>
);

export default TableHeader;
