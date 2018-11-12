// @flow
import * as React from 'react';
import { normalizeURI, convertToShareLink } from 'lbry-redux';
import type { Claim, Metadata } from 'types/claim';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import UriIndicator from 'component/uriIndicator';
import * as icons from 'constants/icons';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';
import { openCopyLinkMenu } from 'util/contextMenu';
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
};

class FileCard extends React.PureComponent<Props> {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.resolve(nextProps);
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
    } = this.props;

    if (!claim && !pending) {
      return (
        <section className="media media--placeholder small">
          <div className="media__thumb" />
          <div className="media__title" />
          <div className="media__channel" />
          <div className="media__date" />
        </section>
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
      openCopyLinkMenu(convertToShareLink(uri), event);
    };

    // We should be able to tab through cards
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <section
        tabIndex="0"
        role="button"
        onClick={!pending ? () => navigate('/show', { uri }) : () => {}}
        className={classnames('media small', {
          'link': !pending,
          'pending': pending,
        })}
        onContextMenu={handleContextMenu}
      >
        <CardMedia thumbnail={thumbnail} />
        <div className="media__title">
          <TruncatedText text={title} lines={2} />
        </div>
        <div className="media__subtitle">
          {pending ? <div>Pending...</div> : <UriIndicator uri={uri} link />}
        </div>
        <div className="media__date">
          <DateTime timeAgo block={height} />
        </div>
        <div className="media__properties">
          <FilePrice hideFree uri={uri} />
          {isRewardContent && <Icon iconColor="red" icon={icons.FEATURED} />}
          {isSubscribed && <Icon icon={icons.HEART} />}
          {fileInfo && <Icon icon={icons.LOCAL} />}
        </div>
      </section>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
