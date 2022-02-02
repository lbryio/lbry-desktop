// @flow
import * as PAGES from 'constants/pages';
import { VIDEO_ALMOST_FINISHED_THRESHOLD } from 'constants/player';
import * as React from 'react';
import classnames from 'classnames';
import { lazyImport } from 'util/lazyImport';
import Page from 'component/page';
import * as RENDER_MODES from 'constants/file_render_modes';
import FileTitleSection from 'component/fileTitleSection';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileRenderDownload from 'component/fileRenderDownload';
import RecommendedContent from 'component/recommendedContent';
import CollectionContent from 'component/collectionContentSidebar';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Empty from 'component/common/empty';
import SwipeableDrawer from 'component/swipeableDrawer';
import * as ICONS from 'constants/icons';
import { useIsMobile } from 'effects/use-screensize';

const CommentsList = lazyImport(() => import('component/commentsList' /* webpackChunkName: "comments" */));
const PostViewer = lazyImport(() => import('component/postViewer' /* webpackChunkName: "postViewer" */));

export const PRIMARY_PLAYER_WRAPPER_CLASS = 'file-page__video-container';

type Props = {
  costInfo: ?{ includesData: boolean, cost: number },
  fileInfo: FileListItem,
  uri: string,
  renderMode: string,
  obscureNsfw: boolean,
  isMature: boolean,
  linkedCommentId?: string,
  hasCollectionById?: boolean,
  collectionId: string,
  videoTheaterMode: boolean,
  claimIsMine: boolean,
  commentsDisabled: boolean,
  isLivestream: boolean,
  position: number,
  commentsListTitle: string,
  doFetchCostInfoForUri: (uri: string) => void,
  doSetContentHistoryItem: (uri: string) => void,
  doSetPrimaryUri: (uri: ?string) => void,
  clearPosition: (uri: string) => void,
};

export default function FilePage(props: Props) {
  const {
    uri,
    renderMode,
    fileInfo,
    obscureNsfw,
    isMature,
    costInfo,
    linkedCommentId,
    videoTheaterMode,

    claimIsMine,
    commentsDisabled,
    hasCollectionById,
    collectionId,
    isLivestream,
    position,
    commentsListTitle,
    doFetchCostInfoForUri,
    doSetContentHistoryItem,
    doSetPrimaryUri,
    clearPosition,
  } = props;

  const isMobile = useIsMobile();

  const [showComments, setShowComments] = React.useState(undefined);

  const cost = costInfo ? costInfo.cost : null;
  const hasFileInfo = fileInfo !== undefined;
  const isMarkdown = renderMode === RENDER_MODES.MARKDOWN;
  const videoPlayedEnoughToResetPosition = React.useMemo(() => {
    const durationInSecs =
      fileInfo && fileInfo.metadata && fileInfo.metadata.video ? fileInfo.metadata.video.duration : 0;
    const isVideoTooShort = durationInSecs <= 45;
    const almostFinishedPlaying = position / durationInSecs >= VIDEO_ALMOST_FINISHED_THRESHOLD;

    return durationInSecs ? isVideoTooShort || almostFinishedPlaying : false;
  }, [fileInfo, position]);

  React.useEffect(() => {
    // always refresh file info when entering file page to see if we have the file
    // this could probably be refactored into more direct components now
    if (collectionId) {
      clearPosition(uri);
    }

    if (fileInfo && videoPlayedEnoughToResetPosition) {
      clearPosition(uri);
    }

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    doFetchCostInfoForUri(uri);
    doSetContentHistoryItem(uri);
    doSetPrimaryUri(uri);

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
  ]);

  function renderFilePageLayout() {
    if (RENDER_MODES.FLOATING_MODES.includes(renderMode)) {
      return (
        <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
          {/* playables will be rendered and injected by <FileRenderFloating> */}
          <FileRenderInitiator uri={uri} videoTheaterMode={videoTheaterMode} />
        </div>
      );
    }

    if (RENDER_MODES.UNRENDERABLE_MODES.includes(renderMode)) {
      return (
        <>
          <FileTitleSection uri={uri} />
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
          <FileTitleSection uri={uri} />
          <FileRenderInitiator uri={uri} />
          <FileRenderInline uri={uri} />
        </>
      );
    }

    if (renderMode === RENDER_MODES.IMAGE) {
      return (
        <>
          <div className="file-render--img-container">
            <FileRenderInitiator uri={uri} />
            <FileRenderInline uri={uri} />
          </div>
          <FileTitleSection uri={uri} />
        </>
      );
    }

    return (
      <>
        <FileRenderInitiator uri={uri} videoTheaterMode={videoTheaterMode} />
        <FileRenderInline uri={uri} />
        <FileTitleSection uri={uri} />
      </>
    );
  }

  const rightSideProps = { hasCollectionById, collectionId, uri };

  if (obscureNsfw && isMature) {
    return (
      <Page className="file-page" filePage isMarkdown={isMarkdown}>
        <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
          <FileTitleSection uri={uri} isNsfwBlocked />
        </div>
        {!isMarkdown && !videoTheaterMode && <RightSideContent {...rightSideProps} />}
      </Page>
    );
  }

  const commentsListElement = commentsDisabled ? (
    <Empty text={__('The creator of this content has disabled comments.')} />
  ) : (
    <CommentsList uri={uri} linkedCommentId={linkedCommentId} />
  );

  return (
    <Page className="file-page" filePage isMarkdown={isMarkdown}>
      <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
        {renderFilePageLayout()}

        {!isMarkdown && (
          <div className="file-page__secondary-content">
            <>
              {claimIsMine && isLivestream && (
                <div className="livestream__creator-message">
                  <h4>{__('Only visible to you')}</h4>
                  <I18nMessage>
                    People who view this link will be redirected to your livestream. Make sure to use this for sharing
                    so your title and thumbnail are displayed properly.
                  </I18nMessage>
                  <div className="section__actions">
                    <Button button="primary" navigate={`/$/${PAGES.LIVESTREAM}`} label={__('View livestream')} />
                  </div>
                </div>
              )}

              {RENDER_MODES.FLOATING_MODES.includes(renderMode) && <FileTitleSection uri={uri} />}

              {isMobile ? (
                <SwipeableDrawer
                  open={Boolean(showComments)}
                  toggleDrawer={() => setShowComments(!showComments)}
                  title={commentsListTitle}
                >
                  {commentsListElement}
                </SwipeableDrawer>
              ) : (
                commentsListElement
              )}
            </>

            {isMobile && (
              <Button
                className="swipeable-drawer__expand-button"
                label={commentsListTitle}
                button="primary"
                icon={ICONS.CHAT}
                onClick={() => setShowComments(!showComments)}
              />
            )}

            {!isMarkdown && videoTheaterMode && <RightSideContent {...rightSideProps} />}
          </div>
        )}
      </div>

      {!isMarkdown
        ? !videoTheaterMode && <RightSideContent {...rightSideProps} />
        : !commentsDisabled && (
            <div className="file-page__post-comments">
              <React.Suspense fallback={null}>
                <CommentsList uri={uri} linkedCommentId={linkedCommentId} commentsAreExpanded />
              </React.Suspense>
            </div>
          )}
    </Page>
  );
}

type RightSideProps = {
  hasCollectionById?: boolean,
  collectionId?: string,
  uri: string,
};

const RightSideContent = (rightSideProps: RightSideProps) => {
  const { hasCollectionById, collectionId, uri } = rightSideProps;

  return hasCollectionById ? <CollectionContent id={collectionId} uri={uri} /> : <RecommendedContent uri={uri} />;
};
