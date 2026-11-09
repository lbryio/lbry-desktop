import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';

type Props = {
  uri: string
};

function FileSubtitle(props: Props) {
  const { uri } = props;

  return (
    <div className="media__subtitle--between">
      <div className="file__viewdate">
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <DateTime uri={uri} show={DateTime.SHOW_DATE} />
        {/* @ts-expect-error - TS2741 (ts-migration) */}
        <FileViewCount uri={uri} />
      </div>

      <FileActions uri={uri} />
    </div>
  );
}

export default FileSubtitle;
