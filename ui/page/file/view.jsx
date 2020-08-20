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
import FileDescription from 'component/fileDescription';
// import WaitUntilOnPage from 'component/common/wait-until-on-page';
import RecommendedContent from 'component/recommendedContent';
import CommentsList from 'component/commentsList';

export const FILE_WRAPPER_CLASS = 'file-page__video-container';

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
};

class FilePage extends React.Component<Props> {
  constructor() {
    super();
    this.lastReset = undefined;
  }

  componentDidMount() {
    const { uri, fetchFileInfo, fetchCostInfo, setViewed, isSubscribed } = this.props;

    if (isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }

    // always refresh file info when entering file page to see if we have the file
    // this could probably be refactored into more direct components now
    // @if TARGET='app'
    fetchFileInfo(uri);
    // @endif

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    fetchCostInfo(uri);
    setViewed(uri);
  }

  componentDidUpdate(prevProps: Props) {
    const { isSubscribed, uri, fileInfo, setViewed, fetchFileInfo } = this.props;

    if (!prevProps.isSubscribed && isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }

    if (prevProps.uri !== uri) {
      setViewed(uri);
      this.lastReset = Date.now();
    }

    // @if TARGET='app'
    if (prevProps.uri !== uri && fileInfo === undefined) {
      fetchFileInfo(uri);
    }
    // @endif
  }

  removeFromSubscriptionNotifications() {
    // Always try to remove
    // If it doesn't exist, nothing will happen
    const { markSubscriptionRead, uri, channelUri } = this.props;
    markSubscriptionRead(channelUri, uri);
  }

  renderFilePageLayout(uri: string, mode: string, cost: ?number) {
    if (RENDER_MODES.FLOATING_MODES.includes(mode)) {
      return (
        <React.Fragment>
          <div className={FILE_WRAPPER_CLASS}>
            <FileRenderInitiator uri={uri} />
          </div>
          {/* playables will be rendered and injected by <FileRenderFloating> */}
          <FileTitle uri={uri} />
        </React.Fragment>
      );
    }

    if (RENDER_MODES.UNRENDERABLE_MODES.includes(mode)) {
      return (
        <React.Fragment>
          <FileTitle uri={uri} />
          <FileRenderDownload uri={uri} isFree={cost === 0} />
        </React.Fragment>
      );
    }

    if (RENDER_MODES.TEXT_MODES.includes(mode)) {
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

  renderBlockedPage() {
    const { uri } = this.props;
    return (
      <Page>
        <FileTitle uri={uri} isNsfwBlocked />
      </Page>
    );
  }

  lastReset: ?any;

  render() {
    const { uri, renderMode, costInfo, obscureNsfw, isMature, linkedComment } = this.props;

    if (obscureNsfw && isMature) {
      return this.renderBlockedPage();
    }

    return (
      <Page className="file-page" filePage>
        <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
          {this.renderFilePageLayout(uri, renderMode, costInfo ? costInfo.cost : null)}
          <FileDescription uri={uri} />
          <FileValues uri={uri} />
          <FileDetails uri={uri} />
          {/* <WaitUntilOnPage lastUpdateDate={this.lastReset} skipWait={Boolean(linkedComment)}> */}
          <CommentsList uri={uri} linkedComment={linkedComment} />
          {/* </WaitUntilOnPage> */}
        </div>

        <RecommendedContent uri={uri} />
      </Page>
    );
  }
}

export default FilePage;
