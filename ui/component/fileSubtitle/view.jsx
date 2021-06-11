// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';

type Props = {
  uri: string,
  livestream?: boolean,
  activeViewers?: number,
  isLive?: boolean,
};

function FileSubtitle(props: Props) {
  const { uri, livestream = false, activeViewers, isLive = false } = props;

  return (
    <div className="media__subtitle--between">
      <div className="file__viewdate">
        {livestream ? <span>{__('Right now')}</span> : <DateTime uri={uri} show={DateTime.SHOW_DATE} />}

        <FileViewCount uri={uri} livestream={livestream} activeViewers={activeViewers} isLive={isLive} />
      </div>
      {/* did I need these params? */}
      <FileActions uri={uri} hideRepost={livestream} livestream={livestream} />
    </div>
  );
}

export default FileSubtitle;
