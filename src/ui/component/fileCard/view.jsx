// @flow
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
import { withRouter } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  fileInfo: ?{},
  metadata: ?StreamMetadata,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
  isSubscribed: boolean,
  isNew: boolean,
  placeholder: boolean,
  preventResolve: boolean,
  history: { push: string => void },
  thumbnail: string,
  title: string,
  nsfw: boolean,
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
      rewardedContentClaimIds,
      obscureNsfw,
      claimIsMine,
      pending,
      isSubscribed,
      isNew,
      isResolvingUri,
      placeholder,
      history,
      thumbnail,
      title,
      nsfw,
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

    // fix to use tags - one of many nsfw tags...
    const shouldHide = !claimIsMine && !pending && obscureNsfw && nsfw;
    if (shouldHide) {
      return null;
    }

    const uri = !pending ? normalizeURI(this.props.uri) : this.props.uri;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);
    const handleContextMenu = event => {
      event.preventDefault();
      event.stopPropagation();
      if (claim) {
        openCopyLinkMenu(convertToShareLink(claim.permanent_url), event);
      }
    };

    const onClick = e => {
      e.stopPropagation();
      history.push(formatLbryUriForWeb(uri));
    };

    return (
      <li
        tabIndex="0"
        role="button"
        onClick={!pending && claim ? onClick : () => {}}
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
            <DateTime timeAgo uri={uri} />
          </div>
        </div>
        <div className="media__properties">
          <FilePrice hideFree uri={uri} />
          {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
          {isSubscribed && <Icon icon={icons.SUBSCRIPTION} />}
          {claimIsMine && <Icon icon={icons.PUBLISHED} />}
          {!claimIsMine && fileInfo && <Icon icon={icons.DOWNLOAD} />}
          {isNew && <span className="badge badge--alert">{__('NEW')}</span>}
        </div>
      </li>
    );
  }
}

export default withRouter(FileCard);
