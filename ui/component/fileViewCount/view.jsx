// @flow
import { SIMPLE_SITE } from 'config';
import React from 'react';
import HelpLink from 'component/common/help-link';
import Tooltip from 'component/common/tooltip';
import { toCompactNotation } from 'util/string';

type Props = {
  livestream?: boolean,
  isLive?: boolean,
  // --- redux ---
  claimId: ?string,
  fetchViewCount: (string) => void,
  uri: string,
  viewCount: string,
  activeViewers?: number,
  lang: string,
};

function FileViewCount(props: Props) {
  const { claimId, fetchViewCount, viewCount, livestream, activeViewers, isLive = false, lang } = props;
  const count = livestream ? activeViewers || 0 : viewCount;
  const countCompact = toCompactNotation(count, lang, 10000);
  const countFullResolution = Number(count).toLocaleString();

  React.useEffect(() => {
    if (claimId) {
      fetchViewCount(claimId);
    }
  }, [claimId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tooltip title={countFullResolution} followCursor placement="top">
      <span className="media__subtitle--centered">
        {livestream &&
          __('%viewer_count% currently %viewer_state%', {
            viewer_count: activeViewers === undefined ? '...' : countCompact,
            viewer_state: isLive ? __('watching') : __('waiting'),
          })}
        {!livestream &&
          activeViewers === undefined &&
          (viewCount !== 1 ? __('%view_count% views', { view_count: countCompact }) : __('1 view'))}
        {!SIMPLE_SITE && <HelpLink href="https://odysee.com/@OdyseeHelp:b/OdyseeBasics:c" />}
      </span>
    </Tooltip>
  );
}

export default FileViewCount;
