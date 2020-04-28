// @flow
import * as React from 'react';
import classnames from 'classnames';
import Page from 'component/page';
import * as RENDER_MODES from 'constants/file_render_modes';
import ClaimUri from 'component/claimUri';
import FileTitle from 'component/fileTitle';
import FileRenderInitiator from 'component/fileRenderInitiator';
import FileRenderInline from 'component/fileRenderInline';
import FileRenderDownload from 'component/fileRenderDownload';
import Card from 'component/common/card';
import FileDetails from 'component/fileDetails';
import FileValues from 'component/fileValues';
import FileDescription from 'component/fileDescription';

import RecommendedContent from 'component/recommendedContent';
import CommentsList from 'component/commentsList';
import CommentCreate from 'component/commentCreate';

export const FILE_WRAPPER_CLASS = 'file-page__video-container';

type Props = {
  claim: StreamClaim,
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
};

class FilePage extends React.Component<Props> {
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
          <ClaimUri uri={uri} />
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
          <ClaimUri uri={uri} />
          <FileTitle uri={uri} />
          <FileRenderDownload uri={uri} isFree={cost === 0} />
        </React.Fragment>
      );
    }

    if (RENDER_MODES.TEXT_MODES.includes(mode)) {
      return (
        <React.Fragment>
          <ClaimUri uri={uri} />
          <FileTitle uri={uri} />
          <FileRenderInitiator uri={uri} />
          <FileRenderInline uri={uri} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <ClaimUri uri={uri} />
        <FileRenderInitiator uri={uri} />
        <FileRenderInline uri={uri} />
        <FileTitle uri={uri} />
      </React.Fragment>
    );
  }

  render() {
    const { uri, renderMode, costInfo } = this.props;

    return (
      <Page className="file-page">
        <div className={classnames('section card-stack', `file-page__${renderMode}`)}>
          {this.renderFilePageLayout(uri, renderMode, costInfo ? costInfo.cost : null)}
        </div>
        <div className="section columns">
          <div className="card-stack">
            <FileDescription uri={uri} />

            <FileValues uri={uri} />

            <FileDetails uri={uri} />

            <Card
              title={__('Leave a Comment')}
              actions={
                <div>
                  <CommentCreate uri={uri} />
                  <CommentsList uri={uri} />
                </div>
              }
            />
          </div>
          <RecommendedContent uri={uri} />
        </div>
      </Page>
    );
  }
}

export default FilePage;
