// @flow
import React from 'react';
import 'scss/component/_view_count.scss';
import { useHistory } from 'react-router';
import { toCompactNotation } from 'util/string';

type Props = {
  uri: string,
  // --- select ---
  claim: ?StreamClaim,
  viewCount: string,
  lang: ?string,
};

export default function FileViewCountInline(props: Props) {
  const { claim, viewCount, lang } = props;
  const {
    location: { pathname },
  } = useHistory();
  const formattedViewCount = toCompactNotation(viewCount, lang);

  // Limit the view-count visibility to Channel Pages for now. I believe we'll
  // eventually show it everywhere, so this band-aid would be the easiest to
  // clean up (only one place edit/remove).
  const isChannelPage = pathname.startsWith('/@');

  // dont show if no view count, if it's a repost or isn't a channel page
  if (!viewCount || (claim && claim.repost_url) || !isChannelPage) {
    // (1) Currently, makeSelectViewCountForUri doesn't differentiate between
    // un-fetched view-count vs zero view-count. But since it's probably not
    // ideal to highlight that a view has 0 count, let's just not show anything.
    // (2) No idea how to get the repost source's claim ID from the repost claim,
    // so hiding it for now.
    return null;
  }

  return (
    <span className="view_count">
      {viewCount !== 1 ? __('%view_count% views', { view_count: formattedViewCount }) : __('1 view')}
    </span>
  );
}
