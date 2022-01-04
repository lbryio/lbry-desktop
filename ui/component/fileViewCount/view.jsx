// @flow
import { SIMPLE_SITE } from 'config';
import React from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  livestream?: boolean,
  isLive?: boolean,
  // --- redux ---
  claimId: ?string,
  fetchViewCount: (string) => void,
  uri: string,
  viewCount: string,
  activeViewers?: number,
};

function FileViewCount(props: Props) {
  const { claimId, fetchViewCount, viewCount, livestream, activeViewers, isLive = false } = props;

  React.useEffect(() => {
    if (claimId) {
      fetchViewCount(claimId);
    }
  }, [claimId]); // eslint-disable-line react-hooks/exhaustive-deps

  const formattedViewCount = Number(viewCount).toLocaleString();

  return (
    <span className="media__subtitle--centered">
      {livestream &&
        __('%viewer_count% currently %viewer_state%', {
          viewer_count: activeViewers === undefined ? '...' : activeViewers,
          viewer_state: isLive ? __('watching') : __('waiting'),
        })}
      {!livestream &&
        activeViewers === undefined &&
        (viewCount !== 1 ? __('%view_count% views', { view_count: formattedViewCount }) : __('1 view'))}
      {!SIMPLE_SITE && <HelpLink href="https://odysee.com/@OdyseeHelp:b/OdyseeBasics:c" />}
    </span>
  );
}

export default FileViewCount;
