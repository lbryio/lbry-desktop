// @flow
import React from 'react';
import 'scss/component/_view_count.scss';
import * as PAGES from 'constants/pages';
import { toCompactNotation } from 'util/string';

type Props = {
  uri: string,
  isLivestream?: boolean,
  // --- redux ---
  claim: ?StreamClaim,
  viewCount: string,
  lang: ?string,
};

export default function FileViewCountInline(props: Props) {
  const { isLivestream, claim, viewCount, lang } = props;
  const formattedViewCount = toCompactNotation(viewCount, lang);

  // Limit the view-count visibility to specific pages for now. We'll eventually
  // show it everywhere, so this band-aid would be the easiest to clean up
  // (only one place edit/remove).
  const pathname: string = window.location.pathname;
  const isOnAllowedPage =
    (pathname && pathname.startsWith('/@') && pathname.indexOf('/', 1) === -1) || // Channel Page
    pathname === `/$/${PAGES.UPLOADS}`;

  if (!viewCount || (claim && claim.repost_url) || isLivestream || !isOnAllowedPage) {
    // (1) Currently, selectViewCountForUri doesn't differentiate between
    // un-fetched vs zero view-count. But since it's probably not ideal to
    // highlight that a claim has 0 view count, let's just not show anything.
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
