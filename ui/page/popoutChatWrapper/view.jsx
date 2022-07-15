// @flow
import { formatLbryChannelName } from 'util/url';
import LivestreamChatLayout from 'component/livestreamChatLayout';
import Page from 'component/page';
import React from 'react';

type Props = {
  claim: StreamClaim,
  uri: string,
  doCommentSocketConnectAsCommenter: (string, string, string) => void,
  doCommentSocketDisconnectAsCommenter: (string, string) => void,
  doResolveUri: (string, boolean) => void,
};

export default function PopoutChatPage(props: Props) {
  const { claim, uri, doCommentSocketConnectAsCommenter, doCommentSocketDisconnectAsCommenter, doResolveUri } = props;

  React.useEffect(() => {
    if (!claim) doResolveUri(uri, true);
  }, [claim, doResolveUri, uri]);

  React.useEffect(() => {
    if (!claim) return;

    const { claim_id: claimId, signing_channel: channelClaim } = claim;
    const channelName = channelClaim && formatLbryChannelName(channelClaim.canonical_url);

    if (claimId && channelName) doCommentSocketConnectAsCommenter(uri, channelName, claimId);

    return () => {
      if (claimId && channelName) doCommentSocketDisconnectAsCommenter(claimId, channelName);
    };
  }, [claim, doCommentSocketConnectAsCommenter, doCommentSocketDisconnectAsCommenter, uri]);

  return (
    <Page noSideNavigation noFooter noHeader isPopoutWindow>
      <LivestreamChatLayout uri={uri} isPopoutWindow />
    </Page>
  );
}
