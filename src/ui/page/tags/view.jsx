// @flow
import React from 'react';
import Page from 'component/page';
import FileListDiscover from 'component/fileListDiscover';

type Props = {
  location: { search: string },
};

function TagsPage(props: Props) {
  const {
    location: { search },
  } = props;

  const urlParams = new URLSearchParams(search);
  const tagsQuery = urlParams.get('t') || '';
  const tags = tagsQuery.split(',');

  return (
    <Page>
      <div className="card">
        <FileListDiscover tags={tags} />
      </div>
    </Page>
  );
}

export default TagsPage;
