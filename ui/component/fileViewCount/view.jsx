// @flow
import React from 'react';
import HelpLink from 'component/common/help-link';
import Tooltip from 'component/common/tooltip';
import { toCompactNotation } from 'util/string';

type Props = {
  claimId: ?string, // this
  fetchViewCount: (string) => void,
  fetchingViewCount: boolean,
  uri: string,
  viewCount: string,
};

function FileViewCount(props: Props) {
  const { claimId, uri, fetchViewCount, viewCount } = props; // claimId
  const countCompact = toCompactNotation(viewCount);
  const countFullResolution = Number(viewCount).toLocaleString();

  React.useEffect(() => {
    if (claimId) {
      fetchViewCount(claimId);
    }
  }, [fetchViewCount, uri, claimId]);

  return (
    <Tooltip label={countFullResolution}>
      <span className="media__subtitle--centered">
        {viewCount !== 1 ? __('%view_count% views', { view_count: countCompact }) : __('1 view')}
        {<HelpLink href="https://lbry.com/faq/views" />}
      </span>
    </Tooltip>
  );
}

export default FileViewCount;
