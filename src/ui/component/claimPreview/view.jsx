// @flow
import React, { Fragment, useEffect } from 'react';
import classnames from 'classnames';
import { parseURI, convertToShareLink } from 'lbry-redux';
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
import Button from 'component/button';

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
  placeholder: string,
  type: string,
  hasVisitedUri: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
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
    filteredOutpoints,
    hasVisitedUri,
  } = props;
  const haventFetched = claim === undefined;
  const abandoned = !isResolvingUri && !claim;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const showPublishLink = abandoned && placeholder === 'publish';
  const minimal = type === 'small' || type === 'tooltip';

  let isValid;
  try {
    parseURI(uri);
    isValid = true;
  } catch (e) {
    isValid = false;
  }

  const isChannel = isValid ? parseURI(uri).isChannel : false;
  let shouldHide =
    placeholder !== 'loading' && ((abandoned && !showPublishLink) || (!claimIsMine && obscureNsfw && nsfw) || !claim);

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(outpoint => outpoint.txid === claim.txid && outpoint.nout === claim.nout);
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !shouldHide && filteredOutpoints) {
    shouldHide = filteredOutpoints.some(
      outpoint =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
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
    if (isValid && !isResolvingUri && haventFetched && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, haventFetched]);

  if (shouldHide) {
    return null;
  }

  if (placeholder === 'loading' || (isResolvingUri && !claim)) {
    return (
      <li className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })} disabled>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-preview-title" />
          <div className="placeholder media__subtitle" />
        </div>
      </li>
    );
  }

  return (
    <li
      role="link"
      onClick={pending || type === 'inline' ? undefined : onClick}
      onContextMenu={handleContextMenu}
      className={classnames('claim-preview', {
        'claim-preview--small': minimal,
        'claim-preview--large': type === 'large',
        'claim-preview--inline': type === 'inline',
        'claim-preview--visited': !isChannel && hasVisitedUri,
        'claim-preview--pending': pending,
      })}
    >
      {isChannel ? <ChannelThumbnail uri={uri} /> : <CardMedia thumbnail={thumbnail} />}
      <div className="claim-preview-metadata">
        <div className="claim-preview-info">
          <div className="claim-preview-title">
            {claim ? <TruncatedText text={title || claim.name} lines={1} /> : <span>{__('Nothing here')}</span>}
          </div>
          {!minimal && (
            <div>
              {isChannel && <SubscribeButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />}
              {!isChannel && <FileProperties uri={uri} />}
            </div>
          )}
        </div>

        <div className="claim-preview-properties">
          <div className="media__subtitle">
            {pending && <div>Pending...</div>}
            {!isResolvingUri && (
              <div>
                {claim ? (
                  <UriIndicator uri={uri} link addTooltip={!minimal} />
                ) : (
                  <Fragment>
                    <div>{__('Publish something and claim this spot!')}</div>
                    <div className="card__actions">
                      <Button button="primary" label={`${__('Publish to')}  ${uri}`} />
                    </div>
                  </Fragment>
                )}
                <div>
                  {isChannel ? (
                    type !== 'inline' && `${claimsInChannel} ${__('publishes')}`
                  ) : (
                    <DateTime timeAgo uri={uri} />
                  )}
                </div>
              </div>
            )}
          </div>
          <ClaimTags uri={uri} type={type} />
        </div>
      </div>
    </li>
  );
}

export default withRouter(ClaimPreview);
