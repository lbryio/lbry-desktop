// @flow
import React, { useEffect } from 'react';
import classnames from 'classnames';
import { convertToShareLink } from 'lbry-redux';
import { withRouter } from 'react-router-dom';
import { openCopyLinkMenu } from 'util/context-menu';
import { formatLbryUriForWeb } from 'util/uri';
import CardMedia from 'component/cardMedia';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import FileProperties from 'component/fileProperties';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';

type Props = {
  uri: string,
  claim: ?Claim,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
  preventResolve: boolean,
  history: { push: string => void },
  thumbnail: string,
  title: string,
  nsfw: boolean,
  placeholder: boolean,
  type: string,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

function ClaimPreview(props: Props) {
  const {
    obscureNsfw,
    claimIsMine,
    pending,
    history,
    uri,
    isResolvingUri,
    thumbnail,
    title,
    nsfw,
    resolveUri,
    claim,
    placeholder,
    type,
    blackListedOutpoints,
  } = props;
  const haventFetched = claim === undefined;
  const abandoned = !isResolvingUri && !claim;
  const isChannel = claim && claim.value_type === 'channel';
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  let shouldHide = abandoned || (!claimIsMine && obscureNsfw && nsfw);

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !shouldHide) {
    for (let i = 0; i < blackListedOutpoints.length; i += 1) {
      const outpoint = blackListedOutpoints[i];
      if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) {
        shouldHide = true;
      }
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    if (claim) {
      openCopyLinkMenu(convertToShareLink(claim.permanent_url), e);
    }
  }

  function onClick(e) {
    if ((isChannel || title) && !pending) {
      history.push(formatLbryUriForWeb(uri));
    }
  }

  useEffect(() => {
    if (!isResolvingUri && haventFetched && uri) {
      resolveUri(uri);
    }
  }, [isResolvingUri, uri, resolveUri, haventFetched]);

  if (shouldHide) {
    return null;
  }

  if (placeholder && !claim) {
    return (
      <li className="claim-list__item" disabled>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-list__item-title" />
          <div className="placeholder media__subtitle" />
        </div>
      </li>
    );
  }

  return (
    <li
      role="link"
      onClick={pending ? undefined : onClick}
      onContextMenu={handleContextMenu}
      className={classnames('claim-list__item', {
        'claim-list__item--large': type === 'large',
        'claim-list__pending': pending,
      })}
    >
      {isChannel ? <ChannelThumbnail uri={uri} /> : <CardMedia thumbnail={thumbnail} />}
      <div className="claim-list__item-metadata">
        <div className="claim-list__item-info">
          <div className="claim-list__item-title">
            <TruncatedText text={title || (claim && claim.name)} lines={1} />
          </div>
          {type !== 'small' && (
            <div>
              {isChannel && <SubscribeButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />}
              {!isChannel && <FileProperties uri={uri} />}
            </div>
          )}
        </div>

        <div className="claim-list__item-properties">
          <div className="media__subtitle">
            <UriIndicator uri={uri} link />
            {pending && <div>Pending...</div>}
            <div>{isChannel ? `${claimsInChannel} ${__('publishes')}` : <DateTime timeAgo uri={uri} />}</div>
          </div>

          <ClaimTags uri={uri} type={type} />
        </div>
      </div>
    </li>
  );
}

export default withRouter(ClaimPreview);
