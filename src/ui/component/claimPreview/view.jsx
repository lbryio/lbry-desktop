// @flow
import type { Node } from 'react';
import React, { Fragment, useEffect, forwardRef } from 'react';
import classnames from 'classnames';
import { parseURI, convertToShareLink } from 'lbry-redux';
import { withRouter } from 'react-router-dom';
import { openCopyLinkMenu } from 'util/context-menu';
import { formatLbryUriForWeb } from 'util/uri';
import { isEmpty } from 'util/object';
import CardMedia from 'component/cardMedia';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import FileProperties from 'component/fileProperties';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';
import BlockButton from 'component/blockButton';
import Button from 'component/button';

type Props = {
  uri: string,
  claim: ?Claim,
  obscureNsfw: boolean,
  showUserBlocked: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
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
  blockedChannelUris: Array<string>,
  channelIsBlocked: boolean,
  isSubscribed: boolean,
  beginPublish: string => void,
  actions: boolean | Node | string | number,
  properties: boolean | Node | string | number,
  onClick?: any => any,
};

const ClaimPreview = forwardRef<any, {}>((props: Props, ref: any) => {
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
    blockedChannelUris,
    hasVisitedUri,
    showUserBlocked,
    channelIsBlocked,
    isSubscribed,
    beginPublish,
    actions,
    properties,
    onClick,
  } = props;
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);
  const abandoned = !isResolvingUri && !claim;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const showPublishLink = abandoned && placeholder === 'publish';
  const hideActions = type === 'small' || type === 'tooltip';

  let name;
  let isValid = false;
  if (uri) {
    try {
      ({ streamName: name } = parseURI(uri));
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const isChannel = isValid ? parseURI(uri).isChannel : false;
  const includeChannelTooltip = type !== 'inline' && type !== 'tooltip' && !isChannel;
  const signingChannel = claim && claim.signing_channel;
  let shouldHide =
    placeholder !== 'loading' && ((abandoned && !showPublishLink) || (!claimIsMine && obscureNsfw && nsfw));

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      outpoint =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
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
  // block stream claims
  if (claim && !shouldHide && !showUserBlocked && blockedChannelUris.length && signingChannel) {
    shouldHide = blockedChannelUris.some(blockedUri => blockedUri === signingChannel.permanent_url);
  }
  // block channel claims if we can't control for them in claim search
  // e.g. fetchRecommendedSubscriptions
  if (claim && isChannel && !shouldHide && !showUserBlocked && blockedChannelUris.length) {
    shouldHide = blockedChannelUris.some(blockedUri => blockedUri === claim.permanent_url);
  }

  function handleContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    if (claim) {
      openCopyLinkMenu(convertToShareLink(claim.permanent_url), e);
    }
  }

  function handleOnClick(e) {
    if (onClick) {
      onClick(e);
    } else if ((isChannel || title) && !pending) {
      history.push(formatLbryUriForWeb(claim && claim.canonical_url ? claim.canonical_url : uri));
    }
  }

  useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, shouldFetch]);

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
      ref={ref}
      role="link"
      onClick={pending || type === 'inline' ? undefined : handleOnClick}
      onContextMenu={handleContextMenu}
      className={classnames('claim-preview', {
        'claim-preview--small': type === 'small' || type === 'tooltip',
        'claim-preview--large': type === 'large',
        'claim-preview--inline': type === 'inline',
        'claim-preview--tooltip': type === 'tooltip',
        'claim-preview--visited': !isChannel && !claimIsMine && hasVisitedUri,
        'claim-preview--pending': pending,
      })}
    >
      {isChannel ? <ChannelThumbnail uri={uri} obscure={channelIsBlocked} /> : <CardMedia thumbnail={thumbnail} />}
      <div className="claim-preview-metadata">
        <div className="claim-preview-info">
          <div className="claim-preview-title">
            {claim ? <TruncatedText text={title || claim.name} lines={1} /> : <span>{__('Nothing here')}</span>}
          </div>
          {!pending && (
            <React.Fragment>
              {hideActions ? null : actions !== undefined ? (
                actions
              ) : (
                <div className="card__actions--inline">
                  {isChannel && !channelIsBlocked && !claimIsMine && (
                    <SubscribeButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                  )}
                  {isChannel && !isSubscribed && !claimIsMine && (
                    <BlockButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                  )}
                  {!isChannel && claim && <FileProperties uri={uri} />}
                </div>
              )}
            </React.Fragment>
          )}
        </div>

        <div className="claim-preview-properties">
          <div className="media__subtitle">
            {!isResolvingUri && (
              <div>
                {claim ? (
                  <UriIndicator uri={uri} link addTooltip={includeChannelTooltip} />
                ) : (
                  <Fragment>
                    <div>{__('Publish something and claim this spot!')}</div>
                    <div className="card__actions">
                      <Button
                        onClick={() => beginPublish(name)}
                        button="primary"
                        label={`${__('Publish to')}  ${uri}`}
                      />
                    </div>
                  </Fragment>
                )}
                <div>
                  {pending ? (
                    <div>Pending...</div>
                  ) : (
                    claim &&
                    (isChannel ? (
                      type !== 'inline' && `${claimsInChannel} ${__('publishes')}`
                    ) : (
                      <DateTime timeAgo uri={uri} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {properties !== undefined ? properties : <ClaimTags uri={uri} type={type} />}
        </div>
      </div>
    </li>
  );
});

export default withRouter(ClaimPreview);
