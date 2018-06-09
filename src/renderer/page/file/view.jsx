// @flow
import * as React from 'react';
import { Lbry, buildURI, normalizeURI, MODALS } from 'lbry-redux';
import ContentPreview from 'component/contentPreview';
import Thumbnail from 'component/common/thumbnail';
import FilePrice from 'component/filePrice';
import FileDetails from 'component/fileDetails';
import FileActions from 'component/fileActions';
import UriIndicator from 'component/uriIndicator';
import { FormField, FormRow } from 'component/common/form';
import Icon from 'component/common/icon';
import DateTime from 'component/dateTime';
import * as icons from 'constants/icons';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import ViewOnWebButton from 'component/viewOnWebButton';
import Page from 'component/page';
import player from 'render-media';
import * as settings from 'constants/settings';
import type { Claim } from 'types/claim';
import type { Subscription } from 'types/subscription';
import FileDownloadLink from 'component/fileDownloadLink';

type Props = {
  claim: Claim,
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
  claimIsMine: boolean,
  autoplay: boolean,
  costInfo: ?{},
  navigate: (string, ?{}) => void,
  openModal: ({ id: string }, { uri: string }) => void,
  fetchFileInfo: string => void,
  fetchCostInfo: string => void,
  prepareEdit: ({}, string) => void,
  setClientSetting: (string, boolean | string) => void,
  checkSubscription: ({ channelName: string, uri: string }) => void,
  subscriptions: Array<Subscription>,
};

class FilePage extends React.Component<Props> {
  static VALID_MEDIA_TYPES = ['audio', '3D-file', 'e-book', 'comic-book'];

  constructor(props: Props) {
    super(props);

    (this: any).onAutoplayChange = this.onAutoplayChange.bind(this);
  }

  componentDidMount() {
    const { uri, fileInfo, fetchFileInfo, fetchCostInfo } = this.props;

    if (fileInfo === undefined) {
      fetchFileInfo(uri);
    }

    // See https://github.com/lbryio/lbry-app/pull/1563 for discussion
    fetchCostInfo(uri);

    this.checkSubscription(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { fetchFileInfo, uri } = this.props;
    if (nextProps.fileInfo === undefined) {
      fetchFileInfo(uri);
    }
  }

  onAutoplayChange(event: SyntheticInputEvent<*>) {
    this.props.setClientSetting(settings.AUTOPLAY, event.target.checked);
  }

  checkSubscription = (props: Props) => {
    if (props.subscriptions.find(sub => sub.channelName === props.claim.channel_name)) {
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
      autoplay,
      costInfo,
    } = this.props;

    // File info
    const { title, thumbnail, filename } = metadata;
    const isRewardContent = rewardedContentClaimIds.includes(claim.claim_id);
    const shouldObscureThumbnail = obscureNsfw && metadata.nsfw;
    const { height, channel_name: channelName, value } = claim;
    // TODO: fix getMediaType logic (lbry-redux)
    const mediaType = Lbry.getMediaType(null, filename) || Lbry.getMediaType(contentType);
    const isPlayable =
      Object.values(player.mime).indexOf(contentType) !== -1 ||
      FilePage.VALID_MEDIA_TYPES.indexOf(mediaType);
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
      editUri = buildURI({ channelName, contentName: claim.name });
    }
    return (
      <Page extraPadding>
        {!claim || !metadata ? (
          <section>
            <span className="empty">{__('Empty claim or metadata info.')}</span>
          </section>
        ) : (
          <section className="card">
            {isPlayable ? (
              <ContentPreview className="content__embedded" uri={uri} />
            ) : (
              <Thumbnail shouldObscure={shouldObscureThumbnail} src={thumbnail} />
            )}
            <div className="card__content">
              <div className="card__title-identity--file">
                <h1 className="card__title card__title--file">{title}</h1>
                <div className="card__title-identity-icons">
                  <FilePrice uri={normalizeURI(uri)} />
                  {isRewardContent && (
                    <Icon iconColor="red" tooltip="bottom" icon={icons.FEATURED} />
                  )}
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
                        prepareEdit(claim, editUri);
                        navigate('/publish');
                      }}
                    />
                  ) : (
                    <React.Fragment>
                      <Button
                        button="alt"
                        icon="Send"
                        label={__('Enjoy this? Send a tip')}
                        onClick={() => openModal({ id: MODALS.SEND_TIP }, { uri })}
                      />
                      <SubscribeButton uri={subscriptionUri} channelName={channelName} />
                    </React.Fragment>
                  )}
                  {speechSharable && (
                    <ViewOnWebButton claimId={claim.claim_id} claimName={claim.name} />
                  )}
                </div>
              </div>
              <FormRow alignRight>
                <FormField
                  type="checkbox"
                  name="autoplay"
                  onChange={this.onAutoplayChange}
                  checked={autoplay}
                  postfix={__('Autoplay')}
                />
              </FormRow>
            </div>

            <div className="card__content">
              <FileDownloadLink uri={uri} />
              <FileActions uri={uri} claimId={claim.claim_id} />
            </div>

            <div className="card__content--extra-padding">
              <FileDetails uri={uri} />
            </div>
          </section>
        )}
      </Page>
    );
  }
}

export default FilePage;
