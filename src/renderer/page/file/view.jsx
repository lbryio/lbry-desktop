// @flow
import React from 'react';
import lbry from 'lbry';
import { buildURI, normalizeURI } from 'lbryURI';
import Video from 'component/video';
import Thumbnail from 'component/common/thumbnail';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/common/icon';
import WalletSendTip from 'component/walletSendTip';
import DateTime from 'component/dateTime';
import * as icons from 'constants/icons';
import Button from 'component/link';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import classnames from 'classnames';
import player from 'render-media';
import * as modals from 'constants/modal_types';

type Props = {
  claim: {
    claim_id: string,
    height: number,
    channel_name: string,
    value: {
      publisherSignature: ?{
        certificateId: ?string
      }
    }
  },
  fileInfo: {},
  metadata: {
    title: string,
    thumbnail: string,
    nsfw: boolean
  },
  contentType: string,
  uri: string,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  playingUri: ?string,
  isPaused: boolean,
  openModal: (string, any) => void,
  fetchFileInfo: (string) => void,
  fetchCostInfo: (string) => void,
}

class FilePage extends React.Component<Props> {
  componentDidMount() {
    this.fetchFileInfo(this.props);
    this.fetchCostInfo(this.props);
    this.checkSubscriptionLatest(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchFileInfo(nextProps);
  }

  fetchFileInfo(props: Props) {
    if (props.fileInfo === undefined) {
      props.fetchFileInfo(props.uri);
    }
  }

  fetchCostInfo(props: Props) {
    if (props.costInfo === undefined) {
      props.fetchCostInfo(props.uri);
    }
  }

  checkSubscriptionLatest(props) {
    if (
      props.subscriptions
        .map(subscription => subscription.channelName)
        .indexOf(props.claim.channel_name) !== -1
    ) {
      props.checkSubscriptionLatest(
        {
          channelName: props.claim.channel_name,
          uri: buildURI(
            {
              contentName: props.claim.channel_name,
              claimId: props.claim.value.publisherSignature.certificateId,
            },
            false
          ),
        },
        buildURI({ contentName: props.claim.name, claimId: props.claim.claim_id }, false)
      );
    }
  }

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      contentType,
      uri,
      rewardedContentClaimIds,
      obscureNsfw,
      playingUri,
      isPaused,
      openModal,
    } = this.props;

    // This should be included below in the page
    // Come back to me
    if (!claim || !metadata) {
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }

    // File info
    const title = metadata.title;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const shouldObscureThumbnail = obscureNsfw && metadata.nsfw;
    const thumbnail = metadata.thumbnail;
    const { height, channel_name: channelName, value } = claim;
    const mediaType = lbry.getMediaType(contentType);
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 || mediaType === 'audio';
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;
    let subscriptionUri;
    if (channelName && channelClaimId) {
      subscriptionUri = buildURI({ channelName, claimId: channelClaimId }, false);
    }

    const isPlaying = playingUri === uri && !isPaused;

    return (
      <Page>
        <section className="card">
          <div>
            {isPlayable ? (
              <Video className="video__embedded" uri={uri} />
            ) : (
              <Thumbnail
                shouldObscure={shouldObscureThumbnail}
                className="video__embedded"
                src={thumbnail}
              />
            )}
            {!isPlaying && (
              <div className="card-media__internal-links">
                <FileActions uri={uri} vertical />
              </div>
            )}
          </div>
          <div className="card--content">
            <div className="card__title-identity--file">
              <h1 className="card__title">{title}</h1>
              <div className="card__title-identity-icons">
                <FilePrice uri={normalizeURI(uri)} />
                {isRewardContent && <Icon icon={icons.FEATURED} />}
              </div>
            </div>
            <span className="card__subtitle card__subtitle--file">
              {__('Published on')} <DateTime block={height} show={DateTime.SHOW_DATE} />
            </span>

            <div className="card__channel-info">
              <UriIndicator uri={uri} link />
              <div className="card__actions card__actions--no-margin">
                <Button
                  alt
                  iconRight="Send"
                  label={__('Enjoy this? Send a tip')}
                  onClick={() => openModal(modals.SEND_TIP, { uri })}
                />
                <SubscribeButton uri={subscriptionUri} channelName={channelName} />
              </div>
            </div>
          </div>

          <div className="card--content">
            <FileDetails uri={uri} />
          </div>
        </section>
      </Page>
    );
  }
}

export default FilePage;
