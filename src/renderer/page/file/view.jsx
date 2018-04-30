// @flow
import * as React from 'react';
import { Lbry, buildURI, normalizeURI, MODALS } from 'lbry-redux';
import Video from 'component/video';
import Thumbnail from 'component/common/thumbnail';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import UriIndicator from 'component/uriIndicator';
import { FormField } from 'component/common/form';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import * as icons from 'constants/icons';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import Page from 'component/page';
import player from 'render-media';
import * as settings from 'constants/settings';

type Props = {
  claim: {
    claim_id: string,
    height: number,
    channel_name: string,
    value: {
      publisherSignature: ?{
        certificateId: ?string,
      },
    },
  },
  fileInfo: {},
  metadata: {
    title: string,
    thumbnail: string,
    nsfw: boolean,
  },
  contentType: string,
  uri: string,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  playingUri: ?string,
  isPaused: boolean,
  claimIsMine: boolean,
  costInfo: ?{},
  navigate: (string, ?{}) => void,
  openModal: ({ id: string }, { uri: string }) => void,
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  prepareEdit: ({}) => void,
  setClientSetting: (string, boolean | string | Price) => void,
};

class FilePage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).onAutoplayChange = this.onAutoplayChange.bind(this);
  }

  componentDidMount() {
    const { uri, fileInfo, fetchFileInfo, costInfo, fetchCostInfo } = this.props;

    if (fileInfo === undefined) {
      fetchFileInfo(uri);
    }

    if (costInfo === undefined) {
      fetchCostInfo(uri);
    }

    this.checkSubscription(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { fetchFileInfo, uri } = this.props;
    if (nextProps.fileInfo === undefined) {
      fetchFileInfo(uri);
    }
  }

  checkSubscription = (props: Props) => {
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
  };

  onAutoplayChange(event: SyntheticInputEvent<*>) {
    this.props.setClientSetting(settings.AUTOPLAY, event.target.checked);
  }

  render() {
    const {
      claim,
      metadata,
      contentType,
      uri,
      rewardedContentClaimIds,
      obscureNsfw,
      playingUri,
      isPaused,
      openModal,
      claimIsMine,
      prepareEdit,
      navigate,
      autoplay,
      setClientSetting
    } = this.props;

    // File info
    const { title, thumbnail } = metadata;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const shouldObscureThumbnail = obscureNsfw && metadata.nsfw;
    const { height, channel_name: channelName, value } = claim;
    const mediaType = Lbry.getMediaType(contentType);
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
      <Page extraPadding>
        {!claim || !metadata ? (
          <section>
            <span className="empty">{__('Empty claim or metadata info.')}</span>
          </section>
        ) : (
          <section className="card">
            {isPlayable ? (
              <Video className="content__embedded" uri={uri} />
            ) : (
              <Thumbnail shouldObscure={shouldObscureThumbnail} src={thumbnail} />
            )}
            {!isPlaying && (
              <div className="card-media__internal-links">
                <FileActions uri={uri} vertical />
              </div>
            )}
            <div className="card__content">
              <div className="card__title-identity--file">
                <h1 className="card__title card__title--file">{title}</h1>
                <div className="card__title-identity-icons">
                  <FilePrice uri={normalizeURI(uri)} />
                  {isRewardContent && <Icon icon={icons.FEATURED} />}
                  <FormField
                    type="checkbox"
                    name="autoplay"
                    className="autoplay"
                    onChange={this.onAutoplayChange}
                    checked={autoplay}
                    postfix={__('Autoplay')}
                  />
                </div>
              </div>
              <span className="card__subtitle card__subtitle--file">
                {__('Published on')}&nbsp;
                <DateTime block={height} show={DateTime.SHOW_DATE} />
              </span>
              {metadata.nsfw && <div>NSFW</div>}
              <div className="card__channel-info">
                <UriIndicator uri={uri} link />
                <div className="card__actions card__actions--no-margin">
                  {claimIsMine ? (
                    <Button
                      button="primary"
                      icon={icons.EDIT}
                      label={__('Edit')}
                      onClick={() => {
                        prepareEdit(claim, uri);
                        navigate('/publish');
                      }}
                    />
                  ) : (
                    <React.Fragment>
                      <Button
                        button="alt"
                        iconRight="Send"
                        label={__('Enjoy this? Send a tip')}
                        onClick={() => openModal({ id: MODALS.SEND_TIP }, { uri })}
                      />
                      <SubscribeButton uri={subscriptionUri} channelName={channelName} />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

            <div className="card__content">
              <FileDetails uri={uri} />
            </div>
          </section>
        )}
      </Page>
    );
  }
}

export default FilePage;
