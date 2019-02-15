// @flow
import type { Claim, Metadata } from 'types/claim';
import type { FileInfo } from 'types/file_info';
import * as MODALS from 'constants/modal_types';
import * as icons from 'constants/icons';
import * as React from 'react';
import { buildURI, normalizeURI } from 'lbry-redux';
import FileViewer from 'component/fileViewer';
import Thumbnail from 'component/common/thumbnail';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import FileDownloadLink from 'component/fileDownloadLink';
import classnames from 'classnames';
import getMediaType from 'util/get-media-type';
import RecommendedContent from 'component/recommendedContent';

type Props = {
  claim: Claim,
  fileInfo: FileInfo,
  metadata: Metadata,
  contentType: string,
  uri: string,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  costInfo: ?{ cost: number },
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  setViewed: string => void,
  isSubscribed: ?string,
  isSubscribed: boolean,
  channelUri: string,
  prepareEdit: ({}, string) => void,
  navigate: (string, ?{}) => void,
  openModal: (id: string, { uri: string }) => void,
  markSubscriptionRead: (string, string) => void,
};

class FilePage extends React.Component<Props> {
  static PLAYABLE_MEDIA_TYPES = ['audio', 'video'];
  static PREVIEW_MEDIA_TYPES = [
    'text',
    'model',
    'image',
    'script',
    'document',
    '3D-file',
    // Bypass unplayable files
    // TODO: Find a better way to detect supported types
    'application',
  ];

  componentDidMount() {
    const { uri, fetchFileInfo, fetchCostInfo, setViewed, isSubscribed } = this.props;

    if (isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }
    // always refresh file info when entering file page
    fetchFileInfo(uri);

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    fetchCostInfo(uri);
    setViewed(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { fetchFileInfo, uri, setViewed } = this.props;
    if (nextProps.fileInfo === undefined) {
      fetchFileInfo(uri);
    }

    if (uri !== nextProps.uri) {
      setViewed(nextProps.uri);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isSubscribed && this.props.isSubscribed) {
      this.removeFromSubscriptionNotifications();
    }
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
      metadata,
      contentType,
      uri,
      rewardedContentClaimIds,
      obscureNsfw,
      openModal,
      claimIsMine,
      prepareEdit,
      navigate,
      costInfo,
      fileInfo,
      channelUri,
    } = this.props;

    // File info
    const { title, thumbnail } = metadata;
    const { height, channel_name: channelName } = claim;
    const { PLAYABLE_MEDIA_TYPES, PREVIEW_MEDIA_TYPES } = FilePage;
    const isRewardContent = (rewardedContentClaimIds || []).includes(claim.claim_id);
    const shouldObscureThumbnail = obscureNsfw && metadata.nsfw;
    const fileName = fileInfo ? fileInfo.file_name : null;
    const mediaType = getMediaType(contentType, fileName);
    const showFile =
      PLAYABLE_MEDIA_TYPES.includes(mediaType) || PREVIEW_MEDIA_TYPES.includes(mediaType);
    const speechShareable =
      costInfo &&
      costInfo.cost === 0 &&
      contentType &&
      ['video', 'image'].includes(contentType.split('/')[0]);
    // We want to use the short form uri for editing
    // This is what the user is used to seeing, they don't care about the claim id
    // We will select the claim id before they publish
    let editUri;
    if (claimIsMine) {
      const uriObject: { contentName: string, claimId: string, channelName?: string } = {
        contentName: claim.name,
        claimId: claim.claim_id,
      };
      if (channelName) {
        uriObject.channelName = channelName;
      }

      editUri = buildURI(uriObject);
    }

    return (
      <Page notContained className="main--file-page">
        <div className="grid-area--content">
          {showFile && <FileViewer className="content__embedded" uri={uri} mediaType={mediaType} />}
          {!showFile &&
            (thumbnail ? (
              <Thumbnail shouldObscure={shouldObscureThumbnail} src={thumbnail} />
            ) : (
              <div
                className={classnames('content__empty', {
                  'content__empty--nsfw': shouldObscureThumbnail,
                })}
              >
                <div className="card__media-text">
                  {__("Sorry, looks like we can't preview this file.")}
                </div>
              </div>
            ))}
        </div>

        <div className="grid-area--info media__content media__content--large">
          <h1 className="media__title media__title--large">{title}</h1>

          <div className="media__properties media__properties--large">
            {isRewardContent && (
              <Icon
                size={20}
                iconColor="red"
                icon={icons.FEATURED}
                // Figure out how to get the tooltip to overlap the navbar on the file page and I will love you
                // https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
                // https://spee.ch/4/overflow-issue
                // tooltip="bottom"
              />
            )}
            {metadata.nsfw && <div className="badge badge--nsfw">NSFW</div>}
            <FilePrice badge uri={normalizeURI(uri)} />
          </div>

          <div className="media__subtext media__subtext--large">
            <div className="media__subtitle__channel">
              <UriIndicator uri={uri} link />
            </div>
            {__('Published on')} <DateTime block={height} show={DateTime.SHOW_DATE} />
          </div>

          <div className="media__actions media__actions--between">
            <div className="media__action-group--large">
              {claimIsMine ? (
                <Button
                  button="primary"
                  icon={icons.EDIT}
                  label={__('Edit')}
                  onClick={() => {
                    prepareEdit(claim, editUri);
                    navigate('/publish');
                  }}
                />
              ) : (
                <SubscribeButton uri={channelUri} channelName={channelName} />
              )}
              {!claimIsMine && (
                <Button
                  button="alt"
                  icon={icons.TIP}
                  label={__('Send a tip')}
                  onClick={() => openModal(MODALS.SEND_TIP, { uri })}
                />
              )}
              <Button
                button="alt"
                icon={icons.SHARE}
                label={__('Share')}
                onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, speechShareable })}
              />
            </div>

            <div className="media__action-group--large">
              <FileDownloadLink uri={uri} />
              <FileActions uri={uri} claimId={claim.claim_id} />
            </div>
          </div>

          <div className="media__info--large">
            <FileDetails uri={uri} />
          </div>
        </div>
        <div className="grid-area--related">
          <RecommendedContent uri={uri} />
        </div>
      </Page>
    );
  }
}

export default FilePage;
