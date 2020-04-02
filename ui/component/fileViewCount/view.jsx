// @flow
import React, { useEffect } from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  claim: StreamClaim,
  fetchViewCount: string => void,
  uri: string,
  viewCount: string,
};

function FileViewCount(props: Props) {
  const { claim, uri, fetchViewCount, viewCount } = props;

  useEffect(() => {
    if (claim && claim.claim_id) {
      fetchViewCount(claim.claim_id);
    }
  }, [fetchViewCount, uri, claim]);

  return (
    <span>
      {viewCount !== 1 ? __('%view_count% Views', { view_count: viewCount }) : __('1 View')}
      <HelpLink href="https://lbry.com/faq/views" />
    </span>
  );
}

export default FileViewCount;
