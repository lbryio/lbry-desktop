// @flow
import * as PAGES from 'constants/pages';
import { VIDEO_ALMOST_FINISHED_THRESHOLD } from 'constants/player';
import * as React from 'react';
import classnames from 'classnames';
import { lazyImport } from 'util/lazyImport';
import Page from 'component/page';
import * as ICONS from 'constants/icons';
import * as DRAWERS from 'constants/drawer_types';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import FileTitleSection from 'component/fileTitleSection';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileRenderDownload from 'component/fileRenderDownload';
import RecommendedContent from 'component/recommendedContent';
import PlaylistCard from 'component/playlistCard';
import Button from 'component/button';
import Empty from 'component/common/empty';
import SwipeableDrawer from 'component/swipeableDrawer';
import DrawerExpandButton from 'component/swipeableDrawerExpand';
import PreorderAndPurchaseContentButton from 'component/preorderAndPurchaseContentButton';
import { useIsMobile, useIsMobileLandscape, useIsMediumScreen } from 'effects/use-screensize';
import ProtectedContentOverlay from 'component/protectedContentOverlay';

const CommentsList = lazyImport(() => import('component/commentsList' /* webpackChunkName: "comments" */));
const PostViewer = lazyImport(() => import('component/postViewer' /* webpackChunkName: "postViewer" */));

export const PRIMARY_PLAYER_WRAPPER_CLASS = 'file-page__video-container';
export const PRIMARY_IMAGE_WRAPPER_CLASS = 'file-render__img-container';

type Props = {
  audioVideoDuration: ?number,
  channelId?: string,
  claimId: string,
  claimIsMine: boolean,
  claimWasPurchased: boolean,
  clearPosition: (uri: string) => void,
  commentsListTitle: string,
  costInfo: ?{ includesData: boolean, cost: number },
  doCheckIfPurchasedClaimId: (claimId: string) => void,
  doClearPlayingUri: () => void,
  doFetchCostInfoForUri: (uri: string) => void,
  doFileGetForUri: (uri: string) => void,
  doSetContentHistoryItem: (uri: string) => void,
  doSetMainPlayerDimension: (dimensions: { height: number, width: number }) => void,
  doSetPrimaryUri: (uri: ?string) => void,
  doToggleAppDrawer: (type: string) => void,
  doMembershipContentforStreamClaimId: (type: string) => void,
  fileInfo: FileListItem,
  isLivestream: boolean,
  isMature: boolean,
  isPlaying?: boolean,
  isUriPlaying: boolean,
  linkedCommentId?: string,
  location: { search: string },
  obscureNsfw: boolean,
  playingCollectionId: ?string,
  position: number,
  preorderTag: number,
  purchaseTag: number,
  renderMode: string,
  rentalTag: string,
  settingsByChannelId: { [channelId: string]: PerChannelSettings },
  commentSettingDisabled: ?boolean,
  threadCommentId?: string,
  uri: string,
  videoTheaterMode: boolean,
  myActiveMemberships: ?MembershipMineDataByKey,
  doMembershipMine: () => void,
  protectedMembershipIds?: Array<number>,
  validMembershipIds?: Array<number>,
  protectedContentTag?: string,
  isProtectedContent?: boolean,
  contentUnlocked: boolean,
};

export default function FilePage(props: Props) {
  const {
    playingCollectionId,
    uri,
    // channelId,
    renderMode,
    fileInfo,
    obscureNsfw,
    isMature,
    costInfo,
    linkedCommentId,
    threadCommentId,
    videoTheaterMode,
    commentSettingDisabled,
    audioVideoDuration,
    claimId,
    claimIsMine,
    claimWasPurchased,
    clearPosition,
    commentsListTitle,
    doCheckIfPurchasedClaimId,
    doFetchCostInfoForUri,
    doFileGetForUri,
    doMembershipContentforStreamClaimId,
    doMembershipMine,
    doSetContentHistoryItem,
    doSetMainPlayerDimension,
    doSetPrimaryUri,
    doToggleAppDrawer,
    isLivestream,
    isUriPlaying,
    location,
    myActiveMemberships,
    position,
    preorderTag,
    purchaseTag,
    rentalTag,
    // settingsByChannelId,
    isProtectedContent,
    contentUnlocked,
  } = props;

  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const colParam = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);
  const initialPlayingCol = React.useRef(playingCollectionId);

  const collectionId = React.useMemo(() => {
    const startedPlayingOtherPlaylist =
      (isUriPlaying || playingCollectionId === null) &&
      playingCollectionId !== undefined &&
      !initialPlayingCol.current !== playingCollectionId;

    return startedPlayingOtherPlaylist ? playingCollectionId : colParam;
  }, [colParam, isUriPlaying, playingCollectionId]);

  const isMobile = useIsMobile();
  const isMediumScreen = useIsMediumScreen() && !isMobile;
  const isLandscapeRotated = useIsMobileLandscape();
  const theaterMode = renderMode === 'video' || renderMode === 'audio' ? videoTheaterMode : false;

  const cost = costInfo ? costInfo.cost : null;
  const hasFileInfo = fileInfo !== undefined;
  const isMarkdown = renderMode === RENDER_MODES.MARKDOWN;
  const videoPlayedEnoughToResetPosition = React.useMemo(() => {
    // I've never seen 'fileInfo' contain metadata lately, but retaining as historical fallback.
    const durationInSecs =
      audioVideoDuration ||
      (fileInfo && fileInfo.metadata && fileInfo.metadata.video ? fileInfo.metadata.video.duration : 0);
    const isVideoTooShort = durationInSecs <= 45;
    const almostFinishedPlaying = position / durationInSecs >= VIDEO_ALMOST_FINISHED_THRESHOLD;

    return durationInSecs ? isVideoTooShort || almostFinishedPlaying : false;
  }, [audioVideoDuration, fileInfo, position]);
  const accessStatus = !isProtectedContent ? undefined : contentUnlocked ? 'unlocked' : 'locked';

  React.useEffect(() => {
    if ((linkedCommentId || threadCommentId) && isMobile) {
      doToggleAppDrawer(DRAWERS.CHAT);
    }
    // only on mount, otherwise clicking on a comments timestamp and linking it
    // would trigger the drawer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (myActiveMemberships === undefined) {
      doMembershipMine();
    }
  }, [doMembershipMine, myActiveMemberships]);

  React.useEffect(() => {
    const aPurchaseOrPreorder = purchaseTag || preorderTag || rentalTag;
    if (aPurchaseOrPreorder && claimId) doCheckIfPurchasedClaimId(claimId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseTag, preorderTag, rentalTag, claimId]);

  React.useEffect(() => {
    if (claimId) {
      doMembershipContentforStreamClaimId(claimId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);

  React.useEffect(() => {
    // always refresh file info when entering file page to see if we have the file
    // this could probably be refactored into more direct components now
    if (fileInfo && videoPlayedEnoughToResetPosition) {
      clearPosition(uri);
    }

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    doFetchCostInfoForUri(uri);
    doSetContentHistoryItem(uri);
    doSetPrimaryUri(uri);
    if (claimWasPurchased && !hasFileInfo) doFileGetForUri(uri);

    return () => doSetPrimaryUri(null);
  }, [
    uri,
    hasFileInfo,
    fileInfo,
    videoPlayedEnoughToResetPosition,
    collectionId,
    clearPosition,
    doFetchCostInfoForUri,
    doSetContentHistoryItem,
    doSetPrimaryUri,
    doFileGetForUri,
    claimWasPurchased,
  ]);

  const playerRef = React.useCallback(
    (node) => {
      if (node) {
        const rect = node.getBoundingClientRect();
        doSetMainPlayerDimension({ height: rect.height, width: rect.width });
      }
    },
    [doSetMainPlayerDimension]
  );

  function renderFilePageLayout() {
    if (RENDER_MODES.FLOATING_MODES.includes(renderMode)) {
      return (
        <div className={PRIMARY_PLAYER_WRAPPER_CLASS} ref={playerRef}>
          <ProtectedContentOverlay uri={uri} />
          {/* playables will be rendered and injected by <FileRenderFloating> */}
          <FileRenderInitiator uri={uri} videoTheaterMode={theaterMode} />
        </div>
      );
    }

    if (RENDER_MODES.UNRENDERABLE_MODES.includes(renderMode) && !isMature) {
      return (
        <>
          <FileTitleSection uri={uri} accessStatus={accessStatus} />
          <FileRenderDownload uri={uri} isFree={cost === 0} />
        </>
      );
    }

    if (isMarkdown) {
      return (
        <React.Suspense fallback={null}>
          <PostViewer uri={uri} />
        </React.Suspense>
      );
    }

    if (RENDER_MODES.TEXT_MODES.includes(renderMode)) {
      return (
        <>
          <div className="file-page__pdf-wrapper">
            <ProtectedContentOverlay uri={uri} />
            <FileRenderInline uri={uri} />
            <FileRenderInitiator uri={uri} />
          </div>
          <FileTitleSection uri={uri} accessStatus={accessStatus} />
        </>
      );
    }

    if (renderMode === RENDER_MODES.IMAGE) {
      return (
        <>
          <div className={PRIMARY_IMAGE_WRAPPER_CLASS}>
            <ProtectedContentOverlay uri={uri} />
            <FileRenderInitiator uri={uri} />
            <FileRenderInline uri={uri} />
          </div>
          <FileTitleSection uri={uri} accessStatus={accessStatus} />
        </>
      );
    }

    return (
      <>
        <FileRenderInitiator uri={uri} videoTheaterMode={theaterMode} />
        <FileRenderInline uri={uri} />
        <FileTitleSection uri={uri} accessStatus={accessStatus} />
      </>
    );
  }

  const rightSideProps = { collectionId, uri, isMediumScreen };

  if (obscureNsfw && isMature) {
    return (
      <Page className="file-page" filePage isMarkdown={isMarkdown}>
        <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
          <FileTitleSection uri={uri} accessStatus={accessStatus} isNsfwBlocked />
        </div>
        {!isMarkdown && !theaterMode && <RightSideContent {...rightSideProps} />}
      </Page>
    );
  }

  const commentsListProps = { uri, linkedCommentId, threadCommentId };
  const emptyMsgProps = { padded: !isMobile };

  return (
    <Page className="file-page" filePage isMarkdown={isMarkdown}>
      <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
        {renderFilePageLayout()}

        {!isMarkdown && (
          <div className="file-page__secondary-content">
            <section className="file-page__media-actions">
              <PreorderAndPurchaseContentButton uri={uri} />
              {claimIsMine && isLivestream && (
                <div className="livestream__creator-message">
                  <h4>{__('Only visible to you')}</h4>
                  {__(
                    'People who view this link will be redirected to your livestream. Make sure to use this for sharing so your title and thumbnail are displayed properly.'
                  )}
                  <div className="section__actions">
                    <Button button="primary" navigate={`/$/${PAGES.LIVESTREAM}`} label={__('View livestream')} />
                  </div>
                </div>
              )}

              {isMediumScreen && <PlaylistCard id={collectionId} uri={uri} colorHeader useDrawer={isMobile} />}

              {RENDER_MODES.FLOATING_MODES.includes(renderMode) && (
                <FileTitleSection uri={uri} accessStatus={accessStatus} />
              )}

              {contentUnlocked && (
                <React.Suspense fallback={null}>
                  {commentSettingDisabled ? (
                    <Empty {...emptyMsgProps} text={__('The creator of this content has disabled comments.')} />
                  ) : isMobile && !isLandscapeRotated ? (
                    <React.Fragment>
                      <SwipeableDrawer type={DRAWERS.CHAT} title={commentsListTitle}>
                        <CommentsList {...commentsListProps} />
                      </SwipeableDrawer>

                      <DrawerExpandButton icon={ICONS.CHAT} label={commentsListTitle} type={DRAWERS.CHAT} />
                    </React.Fragment>
                  ) : (
                    <>
                      {/* normal comments list */}
                      {contentUnlocked && <CommentsList {...commentsListProps} notInDrawer />}
                    </>
                  )}
                </React.Suspense>
              )}
            </section>

            {theaterMode && <RightSideContent {...rightSideProps} />}
          </div>
        )}
      </div>

      {!isMarkdown
        ? !theaterMode && <RightSideContent {...rightSideProps} />
        : !commentSettingDisabled && (
            <div className="file-page__post-comments">
              <React.Suspense fallback={null}>
                <>{contentUnlocked && <CommentsList {...commentsListProps} commentsAreExpanded notInDrawer />}</>
              </React.Suspense>
            </div>
          )}
    </Page>
  );
}

type RightSideProps = {
  collectionId: ?string,
  uri: string,
  isMediumScreen: boolean,
};

const RightSideContent = (rightSideProps: RightSideProps) => {
  const { collectionId, uri, isMediumScreen } = rightSideProps;

  const isMobile = useIsMobile();

  return (
    <div className="card-stack--spacing-m">
      {!isMediumScreen && <PlaylistCard id={collectionId} uri={uri} colorHeader useDrawer={isMobile} />}
      <RecommendedContent uri={uri} />
    </div>
  );
};
