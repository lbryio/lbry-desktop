// @flow
import React from 'react';
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
  showPrice: boolean
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
      showPrice
    } = this.props;
    const uri = normalizeURI(this.props.uri);
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);

    // Come back to this on other pages
    // let description = '';
    // if (isResolvingUri && !claim) {
    //   description = __('Loading...');
    // } else if (metadata && metadata.description) {
    //   description = metadata.description;
    // } else if (claim === null) {
    //   description = __('This address contains no content.');
    // }

    // We don't want to allow a click handler unless it's in focus
    // I'll come back to this when I work on site-wide keyboard navigation
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <section
        tabIndex="0"
        role="button"
        onClick={() => navigate('/show', { uri })}
        className={classnames('card card--small card__link', {
          'card--obscured': shouldObscureNsfw,
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
            <UriIndicator uri={uri} link />
            <div className="card--file-subtitle">
              {isRewardContent && <Icon icon={icons.FEATURED} />}
              {fileInfo && <Icon icon={icons.LOCAL} />}
            </div>
          </div>
        </div>
        {shouldObscureNsfw && <NsfwOverlay />}
      </section>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
