import React from 'react';
import lbry from 'lbry';
import { buildURI, normalizeURI } from 'lbryURI';
import Video from 'component/video';
import { Thumbnail } from 'component/common';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/icon';
import WalletSendTip from 'component/walletSendTip';
import DateTime from 'component/dateTime';
import * as icons from 'constants/icons';
import Link from 'component/link';
import SubscribeButton from 'component/subscribeButton';

class FilePage extends React.PureComponent {
  static propTypes = {
    saveUserHistory: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.fetchFileInfo(this.props);
    this.fetchCostInfo(this.props);
    this.checkSubscription(this.props);
    this.props.saveUserHistory(this.props.uri);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFileInfo(nextProps);
  }

  fetchFileInfo(props) {
    if (props.fileInfo === undefined) {
      props.fetchFileInfo(props.uri);
    }
  }

  fetchCostInfo(props) {
    if (props.costInfo === undefined) {
      props.fetchCostInfo(props.uri);
    }
  }

  checkSubscription(props) {
    if (
      props.subscriptions
        .map(subscription => subscription.channelName)
        .indexOf(props.claim.channel_name) !== -1
    ) {
      props.checkSubscription({
        channelName: props.claim.channel_name,
        uri: buildURI(
          {
            contentName: props.claim.channel_name,
            claimId: props.claim.value.publisherSignature.certificateId,
          },
          false
        ),
      });
    }
  }

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      contentType,
      tab,
      uri,
      rewardedContentClaimIds,
    } = this.props;

    const showTipBox = tab == 'tip';

    if (!claim || !metadata) {
      return <span className="empty">{__('Empty claim or metadata info.')}</span>;
    }

    const title = metadata.title;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const mediaType = lbry.getMediaType(contentType);
    const player = require('render-media');
    const obscureNsfw = this.props.obscureNsfw && metadata && metadata.nsfw;
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 || mediaType === 'audio';
    const { height, channel_name: channelName, value } = claim;
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;

    let subscriptionUri;
    if (channelName && channelClaimId) {
      subscriptionUri = buildURI({ channelName, claimId: channelClaimId }, false);
    }

    return (
      <section className={`card ${obscureNsfw ? 'card--obscured ' : ''}`}>
        <div className="show-page-media">
          {isPlayable ? (
            <Video className="video-embedded" uri={uri} />
          ) : metadata && metadata.thumbnail ? (
            <Thumbnail src={metadata.thumbnail} />
          ) : (
            <Thumbnail />
          )}
        </div>
        <div className="card__inner">
          {(!tab || tab === 'details') && (
            <div>
              {' '}
              <div className="card__title-identity">
                {!fileInfo || fileInfo.written_bytes <= 0 ? (
                  <span style={{ float: 'right' }}>
                    <FilePrice uri={normalizeURI(uri)} />
                    {isRewardContent && (
                      <span>
                        {' '}
                        <Icon icon={icons.FEATURED} />
                      </span>
                    )}
                  </span>
                ) : null}
                <h1>{title}</h1>
                <div className="card__subtitle card--file-subtitle">
                  <UriIndicator uri={uri} link />
                  <span className="card__publish-date">
                    Published on <DateTime block={height} show={DateTime.SHOW_DATE} />
                  </span>
                </div>
              </div>
              <SubscribeButton uri={subscriptionUri} channelName={channelName} />
              <FileDetails uri={uri} />
            </div>
          )}
          {tab === 'tip' && <WalletSendTip claim_id={claim.claim_id} uri={uri} />}
        </div>
      </section>
    );
  }
}

export default FilePage;
