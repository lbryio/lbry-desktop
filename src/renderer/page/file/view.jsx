// @flow
import * as React from 'react';
import * as settings from 'constants/settings';
import { buildURI, normalizeURI, MODALS } from 'lbry-redux';
import FileViewer from 'component/fileViewer';
import Thumbnail from 'component/common/thumbnail';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import * as icons from 'constants/icons';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import type { Claim } from 'types/claim';
import type { Subscription } from 'types/subscription';
import FileDownloadLink from 'component/fileDownloadLink';
import classnames from 'classnames';
import getMediaType from 'util/getMediaType';
import RecommendedContent from 'component/recommendedContent';
import { FormField, FormRow } from 'component/common/form';
import ToolTip from 'component/common/tooltip';

type Props = {
  claim: Claim,
  fileInfo: {},
  metadata: {
    title: string,
    thumbnail: string,
    file_name: string,
    nsfw: boolean,
  },
  contentType: string,
  uri: string,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  costInfo: ?{},
  navigate: (string, ?{}) => void,
  openModal: ({ id: string }, { uri: string }) => void,
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  prepareEdit: ({}, string) => void,
  checkSubscription: (uri: string) => void,
  subscriptions: Array<Subscription>,
  setViewed: string => void,
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

  constructor(props: Props) {
    super(props);

    (this: any).onAutoplayChange = this.onAutoplayChange.bind(this);
  }

  componentDidMount() {
    const { uri, fileInfo, fetchFileInfo, fetchCostInfo, setViewed } = this.props;

    if (fileInfo === undefined) {
      fetchFileInfo(uri);
    }

    // See https://github.com/lbryio/lbry-desktop/pull/1563 for discussion
    fetchCostInfo(uri);

    this.checkSubscription(this.props);

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

  onAutoplayChange(event: SyntheticInputEvent<*>) {
    this.props.setClientSetting(settings.AUTOPLAY, event.target.checked);
  }

  checkSubscription = (props: Props) => {
    if (props.subscriptions.find(sub => sub.channelName === props.claim.channel_name)) {
      props.checkSubscription(
        buildURI(
          {
            contentName: props.claim.channel_name,
            claimId: props.claim.value.publisherSignature.certificateId,
          },
          false
        )
      );
    }
  };

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
      autoplay,
    } = this.props;

    // File info
    const { title, thumbnail } = metadata;
    const { height, channel_name: channelName, value } = claim;
    const { PLAYABLE_MEDIA_TYPES, PREVIEW_MEDIA_TYPES } = FilePage;
    const isRewardContent = (rewardedContentClaimIds || []).includes(claim.claim_id);
    const shouldObscureThumbnail = obscureNsfw && metadata.nsfw;
    const fileName = fileInfo ? fileInfo.file_name : null;
    const mediaType = getMediaType(contentType, fileName);
    const showFile =
      PLAYABLE_MEDIA_TYPES.includes(mediaType) || PREVIEW_MEDIA_TYPES.includes(mediaType);
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;
    let subscriptionUri;
    if (channelName && channelClaimId) {
      subscriptionUri = buildURI({ channelName, claimId: channelClaimId }, false);
    }
    const speechSharable =
      costInfo &&
      costInfo.cost === 0 &&
      contentType &&
      ['video', 'image'].includes(contentType.split('/')[0]);

    // We want to use the short form uri for editing
    // This is what the user is used to seeing, they don't care about the claim id
    // We will select the claim id before they publish
    let editUri;
    if (claimIsMine) {
      const uriObject = { contentName: claim.name, claimId: claim.claim_id };
      if (channelName) {
        uriObject.channelName = channelName;
      }

      editUri = buildURI(uriObject);
    }

    return (
      <Page forContent>
        <section className="content__wrapper">
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

          <div className="card__content">
            <div className="card__title-identity--file">
              <h1 className="card__title card__title--file">{title}</h1>
              <div className="card__title-identity-icons">
                {isRewardContent && <Icon iconColor="red" tooltip="bottom" icon={icons.FEATURED} />}
                <FilePrice filePage uri={normalizeURI(uri)} />
              </div>
            </div>
            <span className="card__subtitle card__subtitle--file">
              {__('Published on')}&nbsp;
              <DateTime block={height} show={DateTime.SHOW_DATE} />
            </span>
            {metadata.nsfw && <div>NSFW</div>}
            <div className="card__channel-info">
              <UriIndicator uri={uri} link />
            </div>
            <div className="card__actions card__actions--no-margin card__actions--between">
              <div className="card__actions">
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
                  <SubscribeButton uri={subscriptionUri} channelName={channelName} />
                )}
                {!claimIsMine && (
                  <Button
                    button="alt"
                    icon={icons.GIFT}
                    label={__('Send a tip')}
                    onClick={() => openModal({ id: MODALS.SEND_TIP }, { uri })}
                  />
                )}
                {speechSharable && (
                  <Button
                    button="alt"
                    icon={icons.GLOBE}
                    label={__('Share')}
                    onClick={() => openModal({ id: MODALS.SOCIAL_SHARE }, { uri })}
                  />
                )}
              </div>

              <div className="card__actions">
                <FileDownloadLink uri={uri} />
                <FileActions uri={uri} claimId={claim.claim_id} />
              </div>
            </div>
            <FormRow padded>
              <ToolTip direction="right" body={__('Automatically download and play free content.')}>
                <FormField
                  name="autoplay"
                  type="checkbox"
                  postfix={__('Autoplay')}
                  checked={autoplay}
                  onChange={this.onAutoplayChange}
                />
              </ToolTip>
            </FormRow>
            <div className="card__content--extra-padding">
              <FileDetails uri={uri} />
            </div>
          </div>
        </section>
        <RecommendedContent uri={uri} />
      </Page>
    );
  }
}

export default FilePage;
