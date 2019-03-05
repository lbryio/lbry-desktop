// @flow
import type { Claim, Metadata } from 'types/claim';
import * as icons from 'constants/icons';
import * as React from 'react';
import { normalizeURI, convertToShareLink } from 'lbry-redux';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import UriIndicator from 'component/uriIndicator';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';
import { openCopyLinkMenu } from 'util/context-menu';
import DateTime from 'component/dateTime';

type Props = {
  uri: string,
  claim: ?Claim,
  fileInfo: ?{},
  metadata: ?Metadata,
  navigate: (string, ?{}) => void,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  /* eslint-disable react/no-unused-prop-types */
  resolveUri: string => void,
  isResolvingUri: boolean,
  /* eslint-enable react/no-unused-prop-types */
  isSubscribed: boolean,
  isNew: boolean,
  placeholder: boolean,
  preventResolve: boolean,
};

class FileCard extends React.PureComponent<Props> {
  static defaultProps = {
    placeholder: false,
    preventResolve: false,
  };

  componentDidMount() {
    if (!this.props.preventResolve) {
      this.resolve(this.props);
    }
  }

  componentDidUpdate() {
    if (!this.props.preventResolve) {
      this.resolve(this.props);
    }
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri, pending } = props;

    if (!pending && !isResolvingUri && claim === undefined && uri) {
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
      pending,
      isSubscribed,
      isNew,
      isResolvingUri,
      placeholder,
    } = this.props;

    const abandoned = !isResolvingUri && !claim && !pending && !placeholder;

    if (abandoned) {
      return null;
    }

    if (!claim && (!pending || placeholder)) {
      return (
        <li className="media-card media-placeholder">
          <div className="media__thumb placeholder" />
          <div className="media__title placeholder" />
          <div className="media__channel placeholder" />
          <div className="media__date placeholder" />
          <div className="media__properties" />
        </li>
      );
    }

    const shouldHide = !claimIsMine && !pending && obscureNsfw && metadata && metadata.nsfw;
    if (shouldHide) {
      return null;
    }

    const uri = !pending ? normalizeURI(this.props.uri) : this.props.uri;
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);
    const height = claim && claim.height;
    const handleContextMenu = event => {
      event.preventDefault();
      event.stopPropagation();
      if (claim) {
        openCopyLinkMenu(convertToShareLink(claim.permanent_url), event);
      }
    };

    // We should be able to tab through cards
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <li
        tabIndex="0"
        role="button"
        onClick={!pending ? () => navigate('/show', { uri }) : () => {}}
        className={classnames('media-card', {
          'card--link': !pending,
          'media--pending': pending,
        })}
        onContextMenu={handleContextMenu}
      >
        <CardMedia thumbnail={thumbnail} />
        <div className="media__title">
          <TruncatedText text={title} lines={2} />
        </div>
        <div className="media__subtitle">
          {pending ? <div>Pending...</div> : <UriIndicator uri={uri} link />}
          <div>
            <DateTime timeAgo block={height} />
          </div>
        </div>
        <div className="media__properties">
          <FilePrice hideFree uri={uri} />
          {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
          {isSubscribed && <Icon icon={icons.SUBSCRIPTION} />}
          {claimIsMine && <Icon icon={icons.PUBLISHED} />}
          {!claimIsMine && fileInfo && <Icon icon={icons.LOCAL} />}
          {isNew && <span className="badge badge--alert">{__('NEW')}</span>}
        </div>
      </li>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
