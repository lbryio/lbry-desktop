// @flow
import * as React from 'react';
import { normalizeURI } from 'lbryURI';
import CardMedia from 'component/cardMedia';
import { TruncatedText } from 'component/common';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import UriIndicator from 'component/uriIndicator';
import NsfwOverlay from 'component/nsfwOverlay';
import * as icons from 'constants/icons';
import classnames from 'classnames';

// TODO: iron these out
type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  uri: string,
  claim: ?{ claim_id: string },
  fileInfo: ?{},
  metadata: ?{ nsfw: boolean, thumbnail: ?string },
  navigate: (string, ?{}) => void,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  showPrice: boolean,
  pending?: boolean
};

class FileCard extends React.PureComponent<Props> {
  static defaultProps = {
    showPrice: true
  }

  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.resolve(nextProps);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      navigate,
      rewardedContentClaimIds,
      obscureNsfw,
      showPrice,
      pending
    } = this.props;
    const uri = !pending ? normalizeURI(this.props.uri) : this.props.uri;
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    // We should be able to tab through cards
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <section
        tabIndex="0"
        role="button"
        onClick={!pending ? () => navigate('/show', { uri }) : () => {}}
        className={classnames('card card--small', {
          'card--obscured': shouldObscureNsfw,
          'card--link': !pending,
          'card--pending': pending
        })}
      >
        <CardMedia thumbnail={thumbnail} />
        <div className="card-media__internal-links">
          {showPrice && <FilePrice uri={uri} />}
        </div>

        <div className="card__title-identity">
          <div className="card__title--small">
            <TruncatedText lines={3}>{title}</TruncatedText>
          </div>
          <div className="card__subtitle">
            {pending ? (
              <div>Pending...</div>
            ) : (
              <React.Fragment>
                <UriIndicator uri={uri} link />
                <div className="card--file-subtitle">
                  {isRewardContent && <Icon icon={icons.FEATURED} />}
                  {fileInfo && <Icon icon={icons.LOCAL} />}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        {shouldObscureNsfw && <NsfwOverlay />}
      </section>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
