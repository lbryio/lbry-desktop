// @flow
import * as React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import * as RENDER_MODES from 'constants/file_render_modes';
import FileTitle from 'component/fileTitle';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileRenderDownload from 'component/fileRenderDownload';
import RecommendedContent from 'component/recommendedContent';
import CommentsList from 'component/commentsList';

export const PRIMARY_PLAYER_WRAPPER_CLASS = 'file-page__video-container';

type Props = {
  costInfo: ?{ includesData: boolean, cost: number },
  fileInfo: FileListItem,
  uri: string,
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  setViewed: string => void,
  renderMode: string,
  obscureNsfw: boolean,
  isMature: boolean,
  linkedComment: any,
  setPrimaryUri: (?string) => void,
  videoTheaterMode: boolean,
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
    linkedComment,
    setPrimaryUri,
    videoTheaterMode,
  } = props;
  const cost = costInfo ? costInfo.cost : null;
  const hasFileInfo = fileInfo !== undefined;

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
          <FileTitle uri={uri} />
          <FileRenderDownload uri={uri} isFree={cost === 0} />
        </React.Fragment>
      );
    }

    if (RENDER_MODES.TEXT_MODES.includes(renderMode)) {
      return (
        <React.Fragment>
          <FileTitle uri={uri} />
          <FileRenderInitiator uri={uri} />
          <FileRenderInline uri={uri} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <FileRenderInitiator uri={uri} videoTheaterMode={videoTheaterMode} />
        <FileRenderInline uri={uri} />
        <FileTitle uri={uri} />
      </React.Fragment>
    );
  }

  if (obscureNsfw && isMature) {
    return (
      <Page>
        <FileTitle uri={uri} isNsfwBlocked />
      </Page>
    );
  }

  return (
    <Page className="file-page" filePage>
      <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
        {renderFilePageLayout()}

        <div className="file-page__secondary-content">
          <div>
            {RENDER_MODES.FLOATING_MODES.includes(renderMode) && <FileTitle uri={uri} />}
            <CommentsList uri={uri} linkedComment={linkedComment} />
          </div>
          {videoTheaterMode && <RecommendedContent uri={uri} />}
        </div>
      </div>

      {!videoTheaterMode && <RecommendedContent uri={uri} />}
    </Page>
  );
}

export default FilePage;
