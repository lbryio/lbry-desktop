// @flow
import { formatLbryChannelName } from 'util/url';
import ChatLayout from 'component/chat';
import Page from 'component/page';
import React from 'react';
import Yrbl from 'component/yrbl';

type Props = {
  claim: StreamClaim,
  uri: string,
  doCommentSocketConnectAsCommenter: (string, string, string, ?boolean) => void,
  doCommentSocketDisconnectAsCommenter: (string, string) => void,
  doResolveUri: (string, boolean) => void,
  isProtectedContent: boolean,
  contentUnlocked: boolean,
  contentRestrictedFromUser: boolean,
};

export default function PopoutChatPage(props: Props) {
  const {
    claim,
    uri,
    doCommentSocketConnectAsCommenter,
    doCommentSocketDisconnectAsCommenter,
    doResolveUri,
    isProtectedContent,
    contentUnlocked,
    contentRestrictedFromUser,
  } = props;

  React.useEffect(() => {
    if (!claim) doResolveUri(uri, true);
  }, [claim, doResolveUri, uri]);

  React.useEffect(() => {
    if (!claim) return;

    const { claim_id: claimId, signing_channel: channelClaim } = claim;
    const channelName = channelClaim && formatLbryChannelName(channelClaim.canonical_url);

    const reversedClaimId = claimId.split('').reverse().join('');
    const claimIdToUse = isProtectedContent ? reversedClaimId : claimId;

    if (claimId && channelName && contentUnlocked) {
      doCommentSocketConnectAsCommenter(uri, channelName, claimIdToUse, isProtectedContent);
    }

    return () => {
      if (claimId && channelName && contentUnlocked) doCommentSocketDisconnectAsCommenter(claimIdToUse, channelName);
    };
  }, [
    claim,
    contentUnlocked,
    doCommentSocketConnectAsCommenter,
    doCommentSocketDisconnectAsCommenter,
    isProtectedContent,
    uri,
  ]);

  if (contentRestrictedFromUser) {
    return (
      <div className="main--empty">
        <Yrbl type="sad" subtitle={__('No results')} />
      </div>
    );
  }

  return (
    <Page noSideNavigation noFooter noHeader isPopoutWindow>
      <ChatLayout uri={uri} isPopoutWindow />
    </Page>
  );
}
