// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';
import ClaimPreviewReset from 'component/claimPreviewReset';
import LivestreamDateTime from 'component/livestreamDateTime';

type Props = {
  uri: string,
  livestream?: boolean,
  isLive?: boolean,
};

function FileSubtitle(props: Props) {
  const { uri, livestream = false, isLive = false } = props;
  return (
    <>
      <div className="media__subtitle--between">
        <div className="file__viewdate">
          {livestream && isLive && <LivestreamDateTime uri={uri} />}
          {!livestream && <DateTime uri={uri} type="date" />}
          <FileViewCount uri={uri} livestream={livestream} isLive={isLive} />
        </div>

        <FileActions uri={uri} hideRepost={livestream} livestream={livestream} />
      </div>
      {livestream && isLive && <ClaimPreviewReset uri={uri} />}
    </>
  );
}

export default FileSubtitle;
