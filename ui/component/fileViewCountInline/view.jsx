// @flow
import React from 'react';

type Props = {
  uri: string,
  isLivestream?: boolean,
  // --- select ---
  claim: ?StreamClaim,
  viewCount: string,
  lang: ?string,
};

export default function FileViewCountInline(props: Props) {
  const { isLivestream, claim, viewCount, lang } = props;
  const formattedViewCount = Number(viewCount).toLocaleString(lang || 'en', {
    compactDisplay: 'short',
    notation: 'compact',
  });

  if (!viewCount || (claim && claim.repost_url) || isLivestream) {
    // (1) Currently, makeSelectViewCountForUri doesn't differentiate between
    // unfetched view-count vs zero view-count. But since it's probably not
    // ideal to highlight that a view has 0 count, let's just not show anything.
    // (2) No idea how to get the repost src's claim ID from the repost claim,
    // so hiding it for now.
    return null;
  }

  return (
    <span className="view_count">
      {viewCount !== 1 ? __('%view_count% views', { view_count: formattedViewCount }) : __('1 view')}
    </span>
  );
}
