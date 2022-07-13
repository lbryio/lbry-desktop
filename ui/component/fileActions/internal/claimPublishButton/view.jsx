// @flow
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import { buildURI } from 'util/lbryURI';
import React from 'react';
import FileActionButton from 'component/common/file-action-button';

type Props = {
  isLivestreamClaim: boolean,
  // redux
  claim: ?Claim,
  channelName: ?string,
  claimIsMine: boolean,
  doPrepareEdit: (claim: Claim, uri: string) => void,
};

function ClaimPublishButton(props: Props) {
  const { isLivestreamClaim, claim, channelName, claimIsMine, doPrepareEdit } = props;

  // We want to use the short form uri for editing
  // This is what the user is used to seeing, they don't care about the claim id
  // We will select the claim id before they publish
  let editUri;
  if (claim && claimIsMine) {
    const { name: claimName, claim_id: claimId } = claim;
    const uriObject: LbryUrlObj = { streamName: claimName, streamClaimId: claimId };

    if (channelName) {
      uriObject.channelName = channelName;
    }

    editUri = buildURI(uriObject);
  }

  return (
    <FileActionButton
      title={isLivestreamClaim ? __('Update or Publish Replay') : __('Edit')}
      label={isLivestreamClaim ? __('Update or Publish Replay') : __('Edit')}
      icon={ICONS.EDIT}
      navigate={`/$/${PAGES.UPLOAD}`}
      onClick={!claim ? undefined : () => doPrepareEdit(claim, editUri)}
    />
  );
}

export default ClaimPublishButton;
