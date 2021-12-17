// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';
import ClaimPreviewReset from 'component/claimPreviewReset';

type Props = {
  uri: string,
  livestream?: boolean,
  isLive?: boolean,
};

function FileSubtitle(props: Props) {
  const { uri, livestream = false, isLive = false } = props;
  const showDateTime = !livestream || (livestream && !isLive);
  return (
    <>
      <div className="media__subtitle--between">
        <div className="file__viewdate">
          {showDateTime && <DateTime uri={uri} show={DateTime.SHOW_DATE} />}

          <FileViewCount uri={uri} livestream={livestream} isLive={isLive} />
        </div>

        <FileActions uri={uri} hideRepost={livestream} livestream={livestream} />
      </div>
      {livestream && isLive && <ClaimPreviewReset uri={uri} />}
    </>
  );
}

export default FileSubtitle;
