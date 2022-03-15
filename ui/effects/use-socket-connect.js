// @flow
import React from 'react';
import { formatLbryChannelName } from 'util/url';

export default function useSocketConnect(
  isLivestreamClaim: boolean,
  claimId: boolean,
  channelUrl: ?string,
  canonicalUrl: boolean,
  doCommentSocketConnect: (string, string, string) => void,
  doCommentSocketDisconnect: (string, string) => void
) {
  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!isLivestreamClaim || !claimId || !channelUrl || !canonicalUrl) return;

    const channelName = formatLbryChannelName(channelUrl);

    doCommentSocketConnect(canonicalUrl, channelName, claimId);

    return () => doCommentSocketDisconnect(claimId, channelName);
  }, [canonicalUrl, channelUrl, claimId, doCommentSocketConnect, doCommentSocketDisconnect, isLivestreamClaim]);
}
