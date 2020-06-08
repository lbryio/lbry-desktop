// @flow
import type { Node } from 'react';
import * as PAGES from 'constants/pages';
import * as CS from 'constants/claim_search';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import FileDownloadLink from 'component/fileDownloadLink';
import { buildURI } from 'lbry-redux';
import * as RENDER_MODES from 'constants/file_render_modes';
import useIsMobile from 'effects/use-is-mobile';
import ClaimSupportButton from 'component/claimSupportButton';

type Props = {
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  prepareEdit: ({}, string, {}) => void,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  costInfo: ?{ cost: number },
  renderMode: string,
};

function FileActions(props: Props) {
  const { fileInfo, uri, openModal, claimIsMine, claim, costInfo, renderMode, prepareEdit } = props;
  const isMobile = useIsMobile();
  const webShareable = costInfo && costInfo.cost === 0 && RENDER_MODES.WEB_SHAREABLE_MODES.includes(renderMode);
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

  const ActionWrapper = (props: { children: Node }) =>
    isMobile ? (
      <React.Fragment>{props.children}</React.Fragment>
    ) : (
      <div className="section__actions section__actions--no-margin">{props.children}</div>
    );

  return (
    <div className="media__actions">
      <ActionWrapper>
        <Button
          button="alt"
          icon={ICONS.SHARE}
          label={__('Share')}
          onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, webShareable })}
        />

        <div className="button-group">
          <Button
            button="alt"
            icon={ICONS.REPOST}
            label={__('Repost')}
            requiresAuth={IS_WEB}
            onClick={() => openModal(MODALS.REPOST, { uri })}
          />
          {claim.meta.reposted > 0 && (
            <Button
              button="alt"
              label={claim.meta.reposted}
              requiresAuth={IS_WEB}
              navigate={`/$/${PAGES.DISCOVER}?${CS.REPOSTED_URI_KEY}=${encodeURIComponent(uri)}`}
            />
          )}
        </div>
        <ClaimSupportButton uri={uri} />
      </ActionWrapper>

      <ActionWrapper>
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
      </ActionWrapper>
    </div>
  );
}

export default FileActions;
