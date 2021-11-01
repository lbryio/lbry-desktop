// @flow
import React from 'react';
import HelpLink from 'component/common/help-link';

type Props = {
  claim: ?StreamClaim,
  fetchViewCount: (string) => void,
  fetchingViewCount: boolean,
  uri: string,
  viewCount: string,
};

function FileViewCount(props: Props) {
  const { claim, uri, fetchViewCount, viewCount } = props;
  const claimId = claim && claim.claim_id;

  React.useEffect(() => {
    if (claimId) {
      fetchViewCount(claimId);
    }
  }, [fetchViewCount, uri, claimId]);

  const formattedViewCount = Number(viewCount).toLocaleString();

  return (
    <span className="media__subtitle--centered">
      {viewCount !== 1 ? __('%view_count% views', { view_count: formattedViewCount }) : __('1 view')}
      {<HelpLink href="https://lbry.com/faq/views" />}
    </span>
  );
}

export default FileViewCount;
