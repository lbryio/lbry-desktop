// @flow
import * as MODALS from 'constants/modal_types';
import * as icons from 'constants/icons';
import * as React from 'react';
import { buildURI, normalizeURI } from 'lbry-redux';
import FileViewerInitiator from 'component/fileViewerInitiator';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import Page from 'component/page';
import FileDownloadLink from 'component/fileDownloadLink';
import RecommendedContent from 'component/recommendedContent';

import CommentsList from 'component/commentsList';
import CommentCreate from 'component/commentCreate';
import ClaimUri from 'component/claimUri';
import ClaimPreview from 'component/claimPreview';
import HelpLink from 'component/common/help-link';
import I18nMessage from 'component/i18nMessage/view';

export const FILE_WRAPPER_CLASS = 'grid-area--content';

type Props = {
  claim: StreamClaim,
  fileInfo: FileListItem,
  contentType: string,
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
  prepareEdit: ({}, string, {}) => void,
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  markSubscriptionRead: (string, string) => void,
  fetchViewCount: string => void,
  balance: number,
  title: string,
  nsfw: boolean,
  supportOption: boolean,
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
    const {
      claim,
      contentType,
      uri,
      openModal,
      claimIsMine,
      prepareEdit,
      costInfo,
      fileInfo,
      channelUri,
      viewCount,
      balance,
      title,
      nsfw,
      supportOption,
    } = this.props;
    // File info
    const { signing_channel: signingChannel } = claim;
    const channelName = signingChannel && signingChannel.name;
    const webShareable =
      costInfo && costInfo.cost === 0 && contentType && ['video', 'image', 'audio'].includes(contentType.split('/')[0]);
    // We want to use the short form uri for editing
    // This is what the user is used to seeing, they don't care about the claim id
    // We will select the claim id before they publish
    let editUri;
    if (claimIsMine) {
      const uriObject: { streamName: string, streamClaimId: string, channelName?: string } = {
        streamName: claim.name,
        streamClaimId: claim.claim_id,
      };
      if (channelName) {
        uriObject.channelName = channelName;
      }

      editUri = buildURI(uriObject);
    }

    const insufficientCredits = !claimIsMine && costInfo && costInfo.cost > balance;

    return (
      <Page className="main--file-page">
        <ClaimUri uri={uri} />

        <div className={`card ${FILE_WRAPPER_CLASS}`}>
          {!fileInfo && insufficientCredits && (
            <div className="media__insufficient-credits help--warning">
              <I18nMessage
                tokens={{
                  reward_link: <Button button="link" navigate="/$/rewards" label={__('Rewards')} />,
                }}
              >
                The publisher has chosen to charge LBC to view this content. Your balance is currently too low to view
                it. Check out %reward_link% for free LBC or send more LBC to your wallet.
              </I18nMessage>
            </div>
          )}
          <FileViewerInitiator uri={uri} insufficientCredits={insufficientCredits} />
        </div>

        <div className="media__title">
          <span className="media__title-badge">
            {nsfw && <span className="badge badge--tag-mature">{__('Mature')}</span>}
          </span>
          <span className="media__title-badge">
            <FilePrice badge uri={normalizeURI(uri)} />
          </span>
          <h1 className="media__title-text">{title}</h1>
        </div>

        <div className="columns">
          <div className="grid-area--info">
            <div className="media__subtitle--between">
              <DateTime uri={uri} show={DateTime.SHOW_DATE} />
              <span>
                {viewCount} {viewCount !== 1 ? __('Views') : __('View')}
                <HelpLink href="https://lbry.com/faq/views" />
              </span>
            </div>
            <div className="media__actions">
              <div className="section__actions">
                {claimIsMine && (
                  <Button
                    button="alt"
                    icon={icons.EDIT}
                    label={__('Edit')}
                    navigate="/$/publish"
                    onClick={() => {
                      prepareEdit(claim, editUri, fileInfo);
                    }}
                  />
                )}
                <Button
                  button="alt"
                  icon={icons.SHARE}
                  label={__('Share')}
                  onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, webShareable })}
                />
                {!claimIsMine && (
                  <Button
                    button="alt"
                    icon={icons.TIP}
                    label={__('Tip')}
                    requiresAuth={IS_WEB}
                    title={__('Send a tip to this creator')}
                    onClick={() => openModal(MODALS.SEND_TIP, { uri, claimIsMine, isSupport: false })}
                  />
                )}
                {(claimIsMine || (!claimIsMine && supportOption)) && (
                  <Button
                    button="alt"
                    icon={icons.SUPPORT}
                    label={__('Support')}
                    requiresAuth={IS_WEB}
                    title={__('Support this claim')}
                    onClick={() => openModal(MODALS.SEND_TIP, { uri, claimIsMine, isSupport: true })}
                  />
                )}
              </div>
              <div className="section__actions">
                {/* @if TARGET='app' */}
                <FileDownloadLink uri={uri} />
                {/* @endif */}
                <FileActions uri={uri} claimId={claim.claim_id} />
              </div>
            </div>

            <div className="section__divider">
              <hr />
            </div>

            {channelUri ? (
              <ClaimPreview uri={channelUri} type="inline" properties={false} hideBlock />
            ) : (
              <div className="claim-preview--inline claim-preview-title">{__('Anonymous')}</div>
            )}

            <FileDetails uri={uri} />

            <div className="section__divider">
              <hr />
            </div>

            <div className="section__title--small">{__('Comments')}</div>
            <section className="section">
              <CommentCreate uri={uri} />
            </section>
            <section className="section">
              <CommentsList uri={uri} />
            </section>
          </div>
          <div className="grid-area--related">
            <RecommendedContent uri={uri} claimId={claim.claim_id} />
          </div>
        </div>
      </Page>
    );
  }
}

export default FilePage;
