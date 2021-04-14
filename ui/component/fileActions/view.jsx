// @flow
import { SIMPLE_SITE, SITE_NAME, ENABLE_FILE_REACTIONS } from 'config';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import FileDownloadLink from 'component/fileDownloadLink';
import { buildURI } from 'lbry-redux';
import * as RENDER_MODES from 'constants/file_render_modes';
import { useIsMobile } from 'effects/use-screensize';
import ClaimSupportButton from 'component/claimSupportButton';
import { useHistory } from 'react-router';
import FileReactions from 'component/fileReactions';

type Props = {
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  prepareEdit: ({}, string, {}) => void,
  claimIsMine: boolean,
  fileInfo: FileListItem,
  costInfo: ?{ cost: number },
  renderMode: string,
  myChannels: ?Array<ChannelClaim>,
  doToast: ({ message: string }) => void,
  clearPlayingUri: () => void,
  hideRepost?: boolean,
  isLivestreamClaim: boolean,
};

function FileActions(props: Props) {
  const {
    fileInfo,
    uri,
    openModal,
    claimIsMine,
    claim,
    costInfo,
    renderMode,
    prepareEdit,
    myChannels,
    clearPlayingUri,
    doToast,
    hideRepost,
    isLivestreamClaim,
  } = props;
  const {
    push,
    location: { pathname },
  } = useHistory();
  const isMobile = useIsMobile();
  const webShareable = costInfo && costInfo.cost === 0 && RENDER_MODES.WEB_SHAREABLE_MODES.includes(renderMode);
  const showDelete = claimIsMine || (fileInfo && (fileInfo.written_bytes > 0 || fileInfo.blobs_completed > 0));
  const hasChannels = myChannels && myChannels.length > 0;
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

  function handleRepostClick() {
    if (!hasChannels) {
      clearPlayingUri();
      push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`);
      doToast({ message: __('A channel is required to repost on %SITE_NAME%', { SITE_NAME }) });
    } else {
      push(`/$/${PAGES.REPOST_NEW}?from=${encodeURIComponent(uri)}&redirect=${pathname}`);
    }
  }

  const lhsSection = (
    <>
      {ENABLE_FILE_REACTIONS && <FileReactions uri={uri} livestream={isLivestreamClaim} />}
      <ClaimSupportButton uri={uri} fileAction />
      {!hideRepost && (
        <Button
          button="alt"
          className="button--file-action"
          icon={ICONS.REPOST}
          label={
            claim.meta.reposted > 1 ? __(`%repost_total% Reposts`, { repost_total: claim.meta.reposted }) : __('Repost')
          }
          description={__('Repost')}
          requiresAuth={IS_WEB}
          onClick={handleRepostClick}
        />
      )}
      <Button
        className="button--file-action"
        icon={ICONS.SHARE}
        label={isMobile ? undefined : __('Share')}
        title={__('Share')}
        onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, webShareable })}
      />
    </>
  );

  const rhsSection = (
    <>
      {!SIMPLE_SITE && <FileDownloadLink uri={uri} />}

      {claimIsMine && (
        <Button
          className="button--file-action"
          icon={ICONS.EDIT}
          label={isLivestreamClaim ? __('Update') : __('Edit')}
          navigate={`/$/${PAGES.UPLOAD}`}
          onClick={() => {
            prepareEdit(claim, editUri, fileInfo);
          }}
        />
      )}
      {showDelete && (
        <Button
          title={__('Remove from your library')}
          className="button--file-action"
          icon={ICONS.DELETE}
          description={__('Delete')}
          onClick={() => openModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
        />
      )}
      {!claimIsMine && (
        <Button
          title={__('Report content')}
          className="button--file-action"
          icon={ICONS.REPORT}
          navigate={`/$/${PAGES.REPORT_CONTENT}?claimId=${claimId}`}
        />
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="media__actions">
        {lhsSection}
        {rhsSection}
      </div>
    );
  } else {
    return (
      <div className="media__actions">
        <div className="section__actions section__actions--no-margin">
          {lhsSection}
          {rhsSection}
        </div>
      </div>
    );
  }
}

export default FileActions;
