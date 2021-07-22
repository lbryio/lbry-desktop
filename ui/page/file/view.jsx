// @flow
import * as PAGES from 'constants/pages';
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
import CommentsList from 'component/commentsList';
import { Redirect } from 'react-router';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';
import Empty from 'component/common/empty';

const PostViewer = lazyImport(() => import('component/postViewer' /* webpackChunkName: "postViewer" */));

export const PRIMARY_PLAYER_WRAPPER_CLASS = 'file-page__video-container';

type Props = {
  costInfo: ?{ includesData: boolean, cost: number },
  fileInfo: FileListItem,
  uri: string,
  fetchFileInfo: (string) => void,
  fetchCostInfo: (string) => void,
  setViewed: (string) => void,
  renderMode: string,
  obscureNsfw: boolean,
  isMature: boolean,
  linkedCommentId?: string,
  setPrimaryUri: (?string) => void,
  collection?: Collection,
  collectionId: string,
  videoTheaterMode: boolean,
  claimIsMine: boolean,
  commentsDisabled: boolean,
  isLivestream: boolean,
};

function FilePage(props: Props) {
  const {
    uri,
    renderMode,
    fetchFileInfo,
    fetchCostInfo,
    setViewed,
    fileInfo,
    obscureNsfw,
    isMature,
    costInfo,
    linkedCommentId,
    setPrimaryUri,
    videoTheaterMode,

    claimIsMine,
    commentsDisabled,
    collection,
    collectionId,
    isLivestream,
  } = props;
  const cost = costInfo ? costInfo.cost : null;
  const hasFileInfo = fileInfo !== undefined;
  const isMarkdown = renderMode === RENDER_MODES.MARKDOWN;

  React.useEffect(() => {
    // always refresh file info when entering file page to see if we have the file
    // this could probably be refactored into more direct components now
    // @if TARGET='app'
    if (!hasFileInfo) {
      fetchFileInfo(uri);
    }
    // @endif

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    fetchCostInfo(uri);
    setViewed(uri);
    setPrimaryUri(uri);

    return () => {
      setPrimaryUri(null);
    };
  }, [uri, hasFileInfo, fetchFileInfo, fetchCostInfo, setViewed, setPrimaryUri]);

  function renderFilePageLayout() {
    if (RENDER_MODES.FLOATING_MODES.includes(renderMode)) {
      return (
        <React.Fragment>
          <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
            <FileRenderInitiator uri={uri} videoTheaterMode={videoTheaterMode} />
          </div>
          {/* playables will be rendered and injected by <FileRenderFloating> */}
        </React.Fragment>
      );
    }

    if (RENDER_MODES.UNRENDERABLE_MODES.includes(renderMode)) {
      return (
        <React.Fragment>
          <FileTitleSection uri={uri} />
          <FileRenderDownload uri={uri} isFree={cost === 0} />
        </React.Fragment>
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
        <React.Fragment>
          <FileTitleSection uri={uri} />
          <FileRenderInitiator uri={uri} />
          <FileRenderInline uri={uri} />
        </React.Fragment>
      );
    }

    if (renderMode === RENDER_MODES.IMAGE) {
      return (
        <React.Fragment>
          <div className="file-render--img-container">
            <FileRenderInitiator uri={uri} />
            <FileRenderInline uri={uri} />
          </div>
          <FileTitleSection uri={uri} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <FileRenderInitiator uri={uri} videoTheaterMode={videoTheaterMode} />
        <FileRenderInline uri={uri} />
        <FileTitleSection uri={uri} />
      </React.Fragment>
    );
  }

  if (!claimIsMine && isLivestream) {
    return <Redirect to={`/$/${PAGES.LIVESTREAM}`} />;
  }

  if (obscureNsfw && isMature) {
    return (
      <Page className="file-page" filePage isMarkdown={isMarkdown}>
        <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
          <FileTitleSection uri={uri} isNsfwBlocked />
        </div>
        {collection && !isMarkdown && !videoTheaterMode && <CollectionContent id={collectionId} uri={uri} />}
        {!collection && !isMarkdown && !videoTheaterMode && <RecommendedContent uri={uri} />}
      </Page>
    );
  }

  return (
    <Page className="file-page" filePage isMarkdown={isMarkdown}>
      <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
        {renderFilePageLayout()}

        {!isMarkdown && (
          <div className="file-page__secondary-content">
            <div>
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
              {commentsDisabled && <Empty text={__('The creator of this content has disabled comments.')} />}
              {!commentsDisabled && <CommentsList uri={uri} linkedCommentId={linkedCommentId} />}
            </div>
            {!collection && !isMarkdown && videoTheaterMode && <RecommendedContent uri={uri} />}
            {collection && !isMarkdown && videoTheaterMode && <CollectionContent id={collectionId} uri={uri} />}
          </div>
        )}
      </div>
      {collection && !isMarkdown && !videoTheaterMode && <CollectionContent id={collectionId} uri={uri} />}
      {!collection && !isMarkdown && !videoTheaterMode && <RecommendedContent uri={uri} />}
      {isMarkdown && (
        <div className="file-page__post-comments">
          <CommentsList uri={uri} linkedCommentId={linkedCommentId} />
        </div>
      )}
    </Page>
  );
}

export default FilePage;
