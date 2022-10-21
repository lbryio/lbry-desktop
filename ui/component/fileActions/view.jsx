// @flow
import { useIsMobile } from 'effects/use-screensize';
import { SITE_NAME, ENABLE_FILE_REACTIONS } from 'config';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import { buildURI } from 'util/lbryURI';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import * as RENDER_MODES from 'constants/file_render_modes';
import ClaimSupportButton from 'component/claimSupportButton';
import ClaimCollectionAddButton from 'component/claimCollectionAddButton';
import { useHistory } from 'react-router';
import FileReactions from 'component/fileReactions';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import { webDownloadClaim } from 'util/downloadClaim';
import ClaimShareButton from 'component/claimShareButton';
import ClaimRepostButton from 'component/claimRepostButton';
import ClaimPublishButton from './internal/claimPublishButton';
import ClaimDeleteButton from './internal/claimDeleteButton';

type Props = {
  uri: string,
  hideRepost?: boolean,
  // redux
  claim: StreamClaim,
  claimIsMine: boolean,
  renderMode: string,
  costInfo: ?{ cost: number },
  hasChannels: boolean,
  isLivestreamClaim: boolean,
  isPostClaim?: boolean,
  streamingUrl: ?string,
  disableDownloadButton: boolean,
  doOpenModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  doPrepareEdit: (claim: Claim, uri: string, claimType: string) => void,
  doToast: (data: { message: string }) => void,
  doDownloadUri: (uri: string) => void,
  isMature: boolean,
  isAPreorder: boolean,
  isProtectedContent: boolean,
  isFiatRequired: boolean,
  isFiatPaid: ?boolean,
  isTierUnlocked: boolean,
};

export default function FileActions(props: Props) {
  const {
    uri,
    claimIsMine,
    claim,
    costInfo,
    renderMode,
    hasChannels,
    hideRepost,
    isLivestreamClaim,
    isPostClaim,
    streamingUrl,
    disableDownloadButton,
    doOpenModal,
    doPrepareEdit,
    doToast,
    doDownloadUri,
    isMature,
    isAPreorder,
    isProtectedContent,
    isFiatRequired,
    isFiatPaid,
    isTierUnlocked,
  } = props;

  const {
    push,
    location: { search },
  } = useHistory();

  const isMobile = useIsMobile();
  const [downloadClicked, setDownloadClicked] = React.useState(false);

  const { claim_id: claimId, signing_channel: signingChannel, value, meta: claimMeta } = claim;
  const channelName = signingChannel && signingChannel.name;
  const fileName = value && value.source && value.source.name;
  const claimType = isLivestreamClaim ? 'livestream' : isPostClaim ? 'post' : 'upload';

  const webShareable = costInfo && costInfo.cost === 0 && RENDER_MODES.WEB_SHAREABLE_MODES.includes(renderMode);
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  const unauthorizedToDownload = isFiatRequired || isProtectedContent;
  const showDownload = !isLivestreamClaim && !disableDownloadButton && !isMature && !unauthorizedToDownload;
  const showRepost = !hideRepost && !isLivestreamClaim;

  // We want to use the short form uri for editing
  // This is what the user is used to seeing, they don't care about the claim id
  // We will select the claim id before they publish
  let editUri;
  if (claimIsMine) {
    const uriObject: LbryUrlObj = {
      streamName: claim.name,
      streamClaimId: claim.claim_id,
    };
    if (channelName) {
      uriObject.channelName = channelName;
    }

    editUri = buildURI(uriObject);
  }

  function isAllowedToReact() {
    const restrictionsCleared = (!isFiatRequired || isFiatPaid) && isTierUnlocked; // should it be OR instead?
    return claimIsMine || restrictionsCleared;
  }

  function handleWebDownload() {
    // doDownloadUri() causes 'streamingUrl' to be populated.
    doDownloadUri(uri);
    setDownloadClicked(true);
  }

  React.useEffect(() => {
    if (downloadClicked && streamingUrl) {
      webDownloadClaim(streamingUrl, fileName);
      setDownloadClicked(false);
    }
  }, [downloadClicked, streamingUrl, fileName]);

  function handleRepostClick() {
    if (!hasChannels) {
      doToast({ message: __('A channel is required to repost on %SITE_NAME%', { SITE_NAME }) });
      return;
    }

    doOpenModal(MODALS.REPOST, { uri });
  }

  return (
    <div className="media__actions">
      {ENABLE_FILE_REACTIONS && isAllowedToReact() && <FileReactions uri={uri} />}

      {!isAPreorder && !isFiatRequired && <ClaimSupportButton uri={uri} fileAction />}

      <ClaimCollectionAddButton uri={uri} />

      {!hideRepost && !isMobile && !isLivestreamClaim && <ClaimRepostButton uri={uri} />}

      <ClaimShareButton uri={uri} fileAction webShareable={webShareable} collectionId={collectionId} />

      {claimIsMine && !isMobile && (
        <>
          <ClaimPublishButton uri={uri} claimType={claimType} />
          <ClaimDeleteButton uri={uri} />
        </>
      )}

      {((isMobile && (showRepost || claimIsMine)) || showDownload || !claimIsMine) && (
        <Menu>
          <MenuButton
            className="button--file-action--menu"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Icon size={20} icon={ICONS.MORE} />
          </MenuButton>

          <MenuList className="menu__list">
            {isMobile && (
              <>
                {showRepost && (
                  <MenuItem className="comment__menu-option" onSelect={handleRepostClick}>
                    <div className="menu__link">
                      <Icon aria-hidden icon={ICONS.REPOST} />
                      {claimMeta.reposted > 1
                        ? __(`%repost_total% Reposts`, { repost_total: claimMeta.reposted })
                        : __('Repost')}
                    </div>
                  </MenuItem>
                )}

                {claimIsMine && (
                  <>
                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() => {
                        doPrepareEdit(claim, editUri, claimType);
                        // push(`/$/${PAGES.UPLOAD}`);
                      }}
                    >
                      <div className="menu__link">
                        <Icon aria-hidden icon={ICONS.EDIT} />
                        {isLivestreamClaim ? __('Update or Publish Replay') : __('Edit')}
                      </div>
                    </MenuItem>

                    <MenuItem
                      className="comment__menu-option"
                      onSelect={() => doOpenModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
                    >
                      <div className="menu__link">
                        <Icon aria-hidden icon={ICONS.DELETE} />
                        {__('Delete')}
                      </div>
                    </MenuItem>
                  </>
                )}
              </>
            )}

            {showDownload && (
              <MenuItem className="comment__menu-option" onSelect={handleWebDownload}>
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.DOWNLOAD} />
                  {__('Download')}
                </div>
              </MenuItem>
            )}

            {!claimIsMine && (
              <MenuItem
                className="comment__menu-option"
                onSelect={() => push(`/$/${PAGES.REPORT_CONTENT}?claimId=${claimId}`)}
              >
                <div className="menu__link">
                  <Icon aria-hidden icon={ICONS.REPORT} />
                  {__('Report content')}
                </div>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
    </div>
  );
}
