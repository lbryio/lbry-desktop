// @flow
import { SIMPLE_SITE } from 'config';
import React, { useEffect } from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  claim: ?StreamClaim,
  fetchViewCount: string => void,
  uri: string,
  viewCount: string,
  livestream?: boolean,
};

function FileViewCount(props: Props) {
  const { claim, uri, fetchViewCount, viewCount, livestream } = props;
  const claimId = claim && claim.claim_id;
  useEffect(() => {
    let interval;

    if (claimId) {
      fetchViewCount(claimId);

      if (livestream) {
        interval = setInterval(() => {
          fetchViewCount(claimId);
        }, 5000);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchViewCount, uri, claimId, livestream]);

  const formattedViewCount = Number(viewCount).toLocaleString();

  return (
    <span className="media__subtitle--centered">
      {viewCount !== 1 ? __('%view_count% views', { view_count: formattedViewCount }) : __('1 view')}
      {!SIMPLE_SITE && <HelpLink href="https://lbry.com/faq/views" />}
    </span>
  );
}

export default FileViewCount;
