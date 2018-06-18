// @flow
import * as React from 'react';
import { normalizeURI, convertToShareLink } from 'lbry-redux';
import Button from 'component/button';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import FilePrice from 'component/filePrice';
import UriIndicator from 'component/uriIndicator';
import * as icons from 'constants/icons';
import classnames from 'classnames';
import { openCopyLinkMenu } from '../../util/contextMenu';

// TODO: iron these out
type Props = {
  uri: string,
  claim: ?{ claim_id: string },
  fileInfo: ?{},
  metadata: ?{ nsfw: boolean, title: string, thumbnail: ?string },
  navigate: (string, ?{}) => void,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  showPrice: boolean,
  pending?: boolean,
  /* eslint-disable react/no-unused-prop-types */
  resolveUri: string => void,
  isResolvingUri: boolean,
  /* eslint-enable react/no-unused-prop-types */
};

class FileCard extends React.PureComponent<Props> {
  static defaultProps = {
    showPrice: true,
  };

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
      claimIsMine,
      showPrice,
      pending,
    } = this.props;
    const uri = !pending ? normalizeURI(this.props.uri) : this.props.uri;
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const shouldObscureNsfw = obscureNsfw && metadata && metadata.nsfw && !claimIsMine;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);
    const handleContextMenu = event => {
      event.preventDefault();
      event.stopPropagation();
      openCopyLinkMenu(convertToShareLink(uri), event);
    };

    // We should be able to tab through cards
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <section
        tabIndex="0"
        role="button"
        onClick={!pending ? () => navigate('/show', { uri }) : () => {}}
        className={classnames('card card--small', {
          'card--link': !pending,
          'card--pending': pending,
        })}
        onContextMenu={handleContextMenu}
      >
        <CardMedia nsfw={shouldObscureNsfw} thumbnail={thumbnail} />
        <div className="card-media__internal-links">{showPrice && <FilePrice uri={uri} />}</div>

        {shouldObscureNsfw ? (
          <div className="card__title-identity">
            <div className="card__title--small">
              <TruncatedText lines={3}>
                {__('This content is obscured because it is NSFW. You can change this in ')}
                <Button
                  button="link"
                  label={__('Settings.')}
                  onClick={e => {
                    // Don't propagate to the onClick handler of parent element
                    e.stopPropagation();
                    navigate('/settings');
                  }}
                />
              </TruncatedText>
            </div>
          </div>
        ) : (
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
                  <div>
                    {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
                    {fileInfo && <Icon icon={icons.LOCAL} />}
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </section>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
