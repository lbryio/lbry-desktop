// @flow
import { useIsMobile } from 'effects/use-screensize';
import { SITE_NAME, ENABLE_FILE_REACTIONS } from 'config';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
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
import Tooltip from 'component/common/tooltip';

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
  streamingUrl: ?string,
  disableDownloadButton: boolean,
  doOpenModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  doEditForChannel: (claim: Claim, uri: string) => void,
  doClearPlayingUri: () => void,
  doToast: (data: { message: string }) => void,
  doDownloadUri: (uri: string) => void,
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
    streamingUrl,
    disableDownloadButton,
    doOpenModal,
    doEditForChannel,
    doClearPlayingUri,
    doToast,
    doDownloadUri,
  } = props;

  const {
    push,
    location: { pathname, search },
  } = useHistory();

  const isMobile = useIsMobile();

  const [downloadClicked, setDownloadClicked] = React.useState(false);

  const { claim_id: claimId, signing_channel: signingChannel, value, meta: claimMeta } = claim;
  const channelName = signingChannel && signingChannel.name;
  const fileName = value && value.source && value.source.name;

  const webShareable = costInfo && costInfo.cost === 0 && RENDER_MODES.WEB_SHAREABLE_MODES.includes(renderMode);
  const urlParams = new URLSearchParams(search);
  const collectionId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

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
      doClearPlayingUri();
      push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`);
      doToast({ message: __('A channel is required to repost on %SITE_NAME%', { SITE_NAME }) });
    } else {
      push(`/$/${PAGES.REPOST_NEW}?from=${encodeURIComponent(uri)}&redirect=${encodeURIComponent(pathname)}`);
    }
  }
  return (
    <div className="media__actions">
      {ENABLE_FILE_REACTIONS && <FileReactions uri={uri} />}

      <ClaimSupportButton uri={uri} fileAction />

      <ClaimCollectionAddButton uri={uri} fileAction />

      {!hideRepost && !isMobile && !isLivestreamClaim && (
        <Tooltip title={__('Repost')} arrow={false}>
          <Button
            button="alt"
            className="button--file-action"
            icon={ICONS.REPOST}
            label={
              claimMeta.reposted > 1 ? __(`%repost_total% Reposts`, { repost_total: claimMeta.reposted }) : __('Repost')
            }
            requiresAuth
            onClick={handleRepostClick}
          />
        </Tooltip>
      )}

      <Tooltip title={__('Share')} arrow={false}>
        <Button
          className="button--file-action"
          icon={ICONS.SHARE}
          label={__('Share')}
          onClick={() => doOpenModal(MODALS.SOCIAL_SHARE, { uri, webShareable, collectionId })}
        />
      </Tooltip>

      {claimIsMine && !isMobile && (
        <>
          <Tooltip title={isLivestreamClaim ? __('Update or Publish Replay') : __('Edit')} arrow={false}>
            <div style={{ margin: '0px' }}>
              <Button
                className="button--file-action"
                icon={ICONS.EDIT}
                label={isLivestreamClaim ? __('Update or Publish Replay') : __('Edit')}
                navigate={`/$/${PAGES.UPLOAD}`}
                onClick={() => doEditForChannel(claim, editUri)}
              />
            </div>
          </Tooltip>

          <Tooltip title={__('Remove from your library')} arrow={false}>
            <Button
              className="button--file-action"
              icon={ICONS.DELETE}
              description={__('Delete')}
              onClick={() => doOpenModal(MODALS.CONFIRM_FILE_REMOVE, { uri })}
            />
          </Tooltip>
        </>
      )}

      {(!isLivestreamClaim || !claimIsMine || isMobile) && (
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
                {!hideRepost && !isLivestreamClaim && (
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
                        doEditForChannel(claim, editUri);
                        push(`/$/${PAGES.UPLOAD}`);
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

            {!isLivestreamClaim && !disableDownloadButton && (
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
