// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Button from 'component/button';
import FileDownloadLink from 'component/fileDownloadLink';
import { buildURI } from 'lbry-redux';
import * as PAGES from '../../constants/pages';
import * as CS from '../../constants/claim_search';

type Props = {
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  prepareEdit: ({}, string, {}) => void,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  costInfo: ?{ cost: number },
  contentType: string,
  supportOption: boolean,
};

function FileActions(props: Props) {
  const { fileInfo, uri, openModal, claimIsMine, claim, costInfo, contentType, supportOption, prepareEdit } = props;
  const webShareable =
    costInfo && costInfo.cost === 0 && contentType && ['video', 'image', 'audio'].includes(contentType.split('/')[0]);
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const claimId = claim && claim.claim_id;
  const { signing_channel: signingChannel } = claim;
  const channelName = signingChannel && signingChannel.name;
  // We want to use the short form uri for editing
  // This is what the user is used to seeing, they don't care about the claim id
  // We will select the claim id before they publish
  let editUri;
  if (claimIsMine) {
    const uriObject: { streamName: string, streamClaimId: string, channelName?: string } = {
      streamName: claim.name,
      streamClaimId: claim.claim_id,
    };
    if (channelName) {
      uriObject.channelName = channelName;
    }

    editUri = buildURI(uriObject);
  }

  let repostLabel = <span>{__('Repost')}</span>;
  if (claim.meta.reposted > 0) {
    repostLabel = (
      <Fragment>
        {repostLabel}
        <Button
          button="alt"
          label={__('(%count%)', { count: claim.meta.reposted })}
          navigate={`/$/${PAGES.DISCOVER}?${CS.REPOSTED_URI_KEY}=${encodeURIComponent(uri)}`}
        />
      </Fragment>
    );
  }

  return (
    <div className="media__actions">
      <div className="section__actions section__actions--no-margin">
        <Button
          button="alt"
          icon={ICONS.SHARE}
          label={__('Share')}
          onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, webShareable })}
        />
        <Button
          button="alt"
          icon={ICONS.REPOST}
          label={repostLabel}
          requiresAuth={IS_WEB}
          onClick={() => openModal(MODALS.REPOST, { uri })}
        />

        {!claimIsMine && (
          <Button
            button="alt"
            icon={ICONS.TIP}
            label={__('Tip')}
            requiresAuth={IS_WEB}
            title={__('Send a tip to this creator')}
            onClick={() => openModal(MODALS.SEND_TIP, { uri, claimIsMine, isSupport: false })}
          />
        )}
        {(claimIsMine || (!claimIsMine && supportOption)) && (
          <Button
            button="alt"
            icon={ICONS.SUPPORT}
            label={__('Support')}
            requiresAuth={IS_WEB}
            title={__('Support this claim')}
            onClick={() => openModal(MODALS.SEND_TIP, { uri, claimIsMine, isSupport: true })}
          />
        )}
      </div>

      <div className="section__actions  section__actions--no-margin">
        <FileDownloadLink uri={uri} />

        {claimIsMine && (
          <Button
            button="alt"
            icon={ICONS.EDIT}
            label={__('Edit')}
            navigate="/$/publish"
            onClick={() => {
              prepareEdit(claim, editUri, fileInfo);
            }}
          />
        )}

        {showDelete && (
          <Button
            title={__('Remove from your library')}
            button="alt"
            icon={ICONS.DELETE}
            description={__('Delete')}
            onClick={() => openModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
          />
        )}
        {!claimIsMine && (
          <Button
            title={__('Report content')}
            button="alt"
            icon={ICONS.REPORT}
            href={`https://lbry.com/dmca/${claimId}`}
          />
        )}
      </div>
    </div>
  );
}

export default FileActions;
