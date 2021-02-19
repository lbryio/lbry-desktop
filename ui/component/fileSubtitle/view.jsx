// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import FileViewCount from 'component/fileViewCount';
import FileActions from 'component/fileActions';

type Props = {
  uri: string,
  livestream?: boolean,
  activeViewers?: number,
};

function FileSubtitle(props: Props) {
  const { uri, livestream, activeViewers = 0 } = props;

  return (
    <div className="media__subtitle--between">
      <div className="file__viewdate">
        {livestream ? <span>{__('Currently live')}</span> : <DateTime uri={uri} show={DateTime.SHOW_DATE} />}
        {activeViewers > 0 ? (
          <span>{__('%view_count% people watching', { view_count: activeViewers })}</span>
        ) : (
          <FileViewCount uri={uri} />
        )}
      </div>

      <FileActions uri={uri} hideRepost={livestream} livestream={livestream} />
    </div>
  );
}

export default FileSubtitle;
