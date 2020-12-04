// @flow
import type { Node } from 'react';
import React, { useEffect, forwardRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { parseURI, convertToShareLink } from 'lbry-redux';
import { openCopyLinkMenu } from 'util/context-menu';
import { formatLbryUrlForWeb } from 'util/url';
import { isEmpty } from 'util/object';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import FileProperties from 'component/fileProperties';
import ClaimTags from 'component/claimTags';
import SubscribeButton from 'component/subscribeButton';
import ChannelThumbnail from 'component/channelThumbnail';
import BlockButton from 'component/blockButton';
import ClaimSupportButton from 'component/claimSupportButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import ClaimPreviewTitle from 'component/claimPreviewTitle';
import ClaimPreviewSubtitle from 'component/claimPreviewSubtitle';
import ClaimRepostAuthor from 'component/claimRepostAuthor';
import FileDownloadLink from 'component/fileDownloadLink';
import AbandonedChannelPreview from 'component/abandonedChannelPreview';
import PublishPending from 'component/publishPending';

type Props = {
  uri: string,
  claim: ?Claim,
  obscureNsfw: boolean,
  showUserBlocked: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  reflectingInfo?: any, // fxme
  resolveUri: string => void,
  isResolvingUri: boolean,
  history: { push: string => void },
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
  actions: boolean | Node | string | number,
  properties: boolean | Node | string | number | (Claim => Node),
  onClick?: any => any,
  hideBlock?: boolean,
  streamingUrl: ?string,
  getFile: string => void,
  customShouldHide?: Claim => boolean,
  showUnresolvedClaim?: boolean,
  showNullPlaceholder?: boolean,
  includeSupportAction?: boolean,
  hideActions?: boolean,
  renderActions?: Claim => ?Node,
  wrapperElement?: string,
  hideRepostLabel?: boolean,
};

const ClaimPreview = forwardRef<any, {}>((props: Props, ref: any) => {
  const {
    obscureNsfw,
    claimIsMine,
    pending,
    reflectingInfo,
    history,
    uri,
    isResolvingUri,
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
    actions,
    properties,
    onClick,
    hideBlock,
    getFile,
    streamingUrl,
    customShouldHide,
    showUnresolvedClaim,
    showNullPlaceholder,
    includeSupportAction,
    hideActions = false,
    renderActions,
    wrapperElement,
    hideRepostLabel = false,
  } = props;
  const WrapperElement = wrapperElement || 'li';
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);
  const abandoned = !isResolvingUri && !claim;
  const showPublishLink = abandoned && !showUnresolvedClaim && placeholder === 'publish';
  const shouldHideActions = hideActions || type === 'small' || type === 'tooltip';
  const canonicalUrl = claim && claim.canonical_url;
  let isValid = false;
  if (uri) {
    try {
      parseURI(uri);
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const isChannel = isValid ? parseURI(uri).isChannel : false;
  const signingChannel = claim && claim.signing_channel;
  const navigateUrl = formatLbryUrlForWeb((claim && claim.canonical_url) || uri || '/');
  const navLinkProps = {
    to: navigateUrl,
    onClick: e => e.stopPropagation(),
  };

  // do not block abandoned and nsfw claims if showUserBlocked is passed
  let shouldHide =
    placeholder !== 'loading' &&
    !showUserBlocked &&
    ((abandoned && !showUnresolvedClaim && !showPublishLink) || (!claimIsMine && obscureNsfw && nsfw));

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !claimIsMine && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      outpoint =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !claimIsMine && !shouldHide && filteredOutpoints) {
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

  if (!shouldHide && customShouldHide && claim) {
    if (customShouldHide(claim)) {
      shouldHide = true;
    }
  }

  // Weird placement warning
  // Make sure this happens after we figure out if this claim needs to be hidden
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, shouldHide);

  function handleContextMenu(e) {
    // @if TARGET='app'
    e.preventDefault();
    e.stopPropagation();
    if (claim) {
      const shareLink = convertToShareLink(claim.canonical_url || claim.permanent_url);
      openCopyLinkMenu(shareLink.replace(/#/g, ':'), e);
    }
    // @endif
  }

  function handleOnClick(e) {
    if (onClick) {
      onClick(e);
    }

    if (claim && !pending) {
      history.push(navigateUrl);
    }
  }

  useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, shouldFetch]);

  if (shouldHide && !showNullPlaceholder) {
    return null;
  }

  const claimPreviewLoading = (
    <li
      disabled
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-preview__title" />
          <div className="placeholder media__subtitle" />
        </div>
      </div>
    </li>
  );

  const claimPreviewNoContent = (
    <li
      disabled
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className={'claim-preview__null-label'}>{__('There is nothing at this location')}</div>
      </div>
    </li>
  );

  const claimPreviewNoMature = (
    <li
      disabled
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className="media__thumb" />

        <div className="blank claim-preview__null-label">{__('Mature content hidden by your preferences')}</div>
      </div>
    </li>
  );

  if (
    placeholder === 'loading' &&
    claim === undefined &&
    shouldHide &&
    showNullPlaceholder &&
    isResolvingUri &&
    !claim
  ) {
    return claimPreviewLoading;
  }

  if (claim && showNullPlaceholder && shouldHide && nsfw) {
    return claimPreviewNoMature;
  }

  if (!claim && showNullPlaceholder) {
    return claimPreviewNoContent;
  }

  if (!shouldFetch && showUnresolvedClaim && !isResolvingUri && claim === null) {
    return <AbandonedChannelPreview uri={uri} type />;
  }
  if (placeholder === 'publish' && !claim && uri.startsWith('lbry://@')) {
    return null;
  }

  return (
    <WrapperElement
      ref={ref}
      role="link"
      onClick={pending || type === 'inline' ? undefined : handleOnClick}
      onContextMenu={handleContextMenu}
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
      })}
    >
      {!hideRepostLabel && <ClaimRepostAuthor uri={uri} />}

      <div
        className={classnames('claim-preview', {
          'claim-preview--small': type === 'small' || type === 'tooltip',
          'claim-preview--large': type === 'large',
          'claim-preview--inline': type === 'inline',
          'claim-preview--tooltip': type === 'tooltip',
          'claim-preview--channel': isChannel,
          'claim-preview--visited': !isChannel && !claimIsMine && hasVisitedUri,
          'claim-preview--pending': pending,
        })}
      >
        {isChannel && claim ? (
          <UriIndicator uri={uri} link>
            <ChannelThumbnail uri={uri} obscure={channelIsBlocked} />
          </UriIndicator>
        ) : (
          <>
            {showPublishLink ? null : !pending ? (
              <NavLink {...navLinkProps}>
                <FileThumbnail thumbnail={thumbnailUrl}>
                  {/* @if TARGET='app' */}
                  {claim && (
                    <div className="claim-preview__hover-actions">
                      <FileDownloadLink uri={canonicalUrl} hideOpenButton hideDownloadStatus />
                    </div>
                  )}
                  {/* @endif */}
                  <div className="claim-preview__file-property-overlay">
                    <FileProperties uri={uri} small />
                  </div>
                </FileThumbnail>
              </NavLink>
            ) : (
              <FileThumbnail thumbnail={thumbnailUrl} />
            )}
          </>
        )}

        <div className="claim-preview__text">
          <div className="claim-preview-metadata">
            <div className="claim-preview-info">
              {pending ? (
                <ClaimPreviewTitle uri={uri} />
              ) : (
                <NavLink {...navLinkProps}>
                  <ClaimPreviewTitle uri={uri} />
                </NavLink>
              )}
            </div>
            <ClaimPreviewSubtitle uri={uri} type={type} />
            {(pending || !!reflectingInfo) && <PublishPending uri={uri} />}
          </div>
          {type !== 'small' && (
            <div className="claim-preview__actions">
              {!pending && (
                <>
                  {renderActions && claim && renderActions(claim)}
                  {shouldHideActions || renderActions ? null : actions !== undefined ? (
                    actions
                  ) : (
                    <div className="claim-preview__primary-actions">
                      {isChannel && !channelIsBlocked && !claimIsMine && (
                        <SubscribeButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                      )}
                      {!hideBlock && isChannel && !isSubscribed && (!claimIsMine || channelIsBlocked) && (
                        <BlockButton uri={uri.startsWith('lbry://') ? uri : `lbry://${uri}`} />
                      )}
                      {includeSupportAction && <ClaimSupportButton uri={uri} />}
                    </div>
                  )}
                </>
              )}
              {claim && (
                <React.Fragment>
                  {typeof properties === 'function' ? (
                    properties(claim)
                  ) : properties !== undefined ? (
                    properties
                  ) : (
                    <ClaimTags uri={uri} type={type} />
                  )}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </WrapperElement>
  );
});

export default withRouter(ClaimPreview);
