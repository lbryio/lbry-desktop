// @flow
import * as React from 'react';
import Button from 'component/button';
import Page from 'component/page';
import I18nMessage from 'component/i18nMessage/view';
import LayoutWrapperFile from 'component/layoutWrapperFile';
import LayoutWrapperText from 'component/layoutWrapperText';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  uri: string,
  claimIsMine: boolean,
  costInfo: ?{ cost: number },
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  setViewed: string => void,
  isSubscribed: ?string,
  isSubscribed: boolean,
  channelUri: string,
  viewCount: number,
  markSubscriptionRead: (string, string) => void,
  fetchViewCount: string => void,
  balance: number,
  mediaType: string,
};

class FilePage extends React.Component<Props> {
  componentDidMount() {
    const { uri, claim, fetchFileInfo, fetchCostInfo, setViewed, isSubscribed, fetchViewCount } = this.props;

    if (isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }

    fetchViewCount(claim.claim_id);

    // always refresh file info when entering file page to see if we have the file
    // @if TARGET='app'
    fetchFileInfo(uri);
    // @endif

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    fetchCostInfo(uri);
    setViewed(uri);
  }

  componentDidUpdate(prevProps: Props) {
    const { isSubscribed, claim, uri, fileInfo, setViewed, fetchViewCount, fetchFileInfo } = this.props;

    if (!prevProps.isSubscribed && isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }

    if (prevProps.uri !== uri) {
      fetchViewCount(claim.claim_id);
    }

    if (prevProps.uri !== uri) {
      setViewed(uri);
    }

    // @if TARGET='app'
    if (fileInfo === undefined) {
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

  render() {
    const { uri, claimIsMine, costInfo, fileInfo, balance, mediaType } = this.props;
    const insufficientCredits = !claimIsMine && costInfo && costInfo.cost > balance;

    return (
      <Page className="main--file-page">
        {!fileInfo && insufficientCredits && (
          <div className="media__insufficient-credits help--warning">
            <I18nMessage
              tokens={{
                reward_link: <Button button="link" navigate="/$/rewards" label={__('Rewards')} />,
              }}
            >
              The publisher has chosen to charge LBC to view this content. Your balance is currently too low to view it.
              Check out %reward_link% for free LBC or send more LBC to your wallet.
            </I18nMessage>
          </div>
        )}

        {mediaType === 'text' ? <LayoutWrapperText uri={uri} /> : <LayoutWrapperFile uri={uri} />}
      </Page>
    );
  }
}

export default FilePage;
