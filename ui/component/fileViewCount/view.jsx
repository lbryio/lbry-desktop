// @flow
import { SIMPLE_SITE } from 'config';
import React from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  claim: ?StreamClaim,
  fetchViewCount: (string) => void,
  fetchingViewCount: boolean,
  uri: string,
  viewCount: string,
  livestream?: boolean,
  activeViewers?: number,
  isLive?: boolean,
  doAnalyticsView: (string) => void,
};

function FileViewCount(props: Props) {
  const { claim, uri, fetchViewCount, viewCount, livestream, activeViewers, isLive = false, doAnalyticsView } = props;
  const claimId = claim && claim.claim_id;

  React.useEffect(() => {
    if (livestream) {
      // Regular claims will call the file/view event when a user actually watches the claim
      // This can be removed when we get rid of the livestream iframe
      doAnalyticsView(uri);
    }
  }, [livestream, doAnalyticsView, uri]);

  React.useEffect(() => {
    if (claimId) {
      fetchViewCount(claimId);
    }
  }, [fetchViewCount, uri, claimId]);

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
      {!SIMPLE_SITE && <HelpLink href="https://lbry.com/faq/views" />}
    </span>
  );
}

export default FileViewCount;
