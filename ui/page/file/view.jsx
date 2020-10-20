// @flow
import * as React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import * as RENDER_MODES from 'constants/file_render_modes';
import FileTitle from 'component/fileTitle';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileRenderDownload from 'component/fileRenderDownload';
import FileDetails from 'component/fileDetails';
import FileValues from 'component/fileValues';
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
  isSubscribed: boolean,
  channelUri: string,
  renderMode: string,
  markSubscriptionRead: (string, string) => void,
  obscureNsfw: boolean,
  isMature: boolean,
  linkedComment: any,
  setPrimaryUri: (?string) => void,
};

function FilePage(props: Props) {
  const {
    uri,
    channelUri,
    renderMode,
    fetchFileInfo,
    fetchCostInfo,
    setViewed,
    isSubscribed,
    fileInfo,
    markSubscriptionRead,
    obscureNsfw,
    isMature,
    costInfo,
    linkedComment,
    setPrimaryUri,
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

  React.useEffect(() => {
    // Always try to remove
    // If it doesn't exist, nothing will happen
    if (isSubscribed) {
      markSubscriptionRead(channelUri, uri);
    }
  }, [isSubscribed, markSubscriptionRead, uri, channelUri]);

  function renderFilePageLayout() {
    if (RENDER_MODES.FLOATING_MODES.includes(renderMode)) {
      return (
        <React.Fragment>
          <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
            <FileRenderInitiator uri={uri} />
          </div>
          {/* playables will be rendered and injected by <FileRenderFloating> */}
          <FileTitle uri={uri} />
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
        <FileRenderInitiator uri={uri} />
        <FileRenderInline uri={uri} />
        <FileTitle uri={uri} />
      </React.Fragment>
    );
  }

  function renderBlockedPage() {
    return (
      <Page>
        <FileTitle uri={uri} isNsfwBlocked />
      </Page>
    );
  }

  if (obscureNsfw && isMature) {
    return renderBlockedPage();
  }

  return (
    <Page className="file-page" filePage>
      <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
        {renderFilePageLayout()}
        <FileValues uri={uri} />
        <FileDetails uri={uri} />

        <CommentsList uri={uri} linkedComment={linkedComment} />
      </div>

      <RecommendedContent uri={uri} />
    </Page>
  );
}

export default FilePage;
