// @flow
import React from 'react';
import { formatLbryChannelName } from 'util/url';

export default function useSocketConnect(
  isLivestreamClaim: boolean,
  claimId: ?string,
  channelUrl: ?string,
  canonicalUrl: ?string,
  doCommentSocketConnect: (canonicalUrl: string, channelName: string, claimId: string) => void,
  doCommentSocketDisconnect: (claimId: string, string) => void
) {
  // Establish web socket connection for viewer count.
  React.useEffect(() => {
    if (!isLivestreamClaim || !claimId || !channelUrl || !canonicalUrl) return;

    const channelName = formatLbryChannelName(channelUrl);

    doCommentSocketConnect(canonicalUrl, channelName, claimId);

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId, channelName);
      }
    };
  }, [canonicalUrl, channelUrl, claimId, doCommentSocketConnect, doCommentSocketDisconnect, isLivestreamClaim]);
}
