// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';

type Props = {
  uri: string,
};

function FileSubtitle(props: Props) {
  const { uri } = props;

  return (
    <div className="media__subtitle--between">
      <div className="file__viewdate">
        <DateTime uri={uri} show={DateTime.SHOW_DATE} />
        <FileViewCount uri={uri} />
      </div>

      <FileActions uri={uri} />
    </div>
  );
}

export default FileSubtitle;
