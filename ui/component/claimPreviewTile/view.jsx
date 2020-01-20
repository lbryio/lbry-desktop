// @flow
import React from 'react';
import classnames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import FileThumbnail from 'component/fileThumbnail';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import DateTime from 'component/dateTime';
import ChannelThumbnail from 'component/channelThumbnail';
import SubscribeButton from 'component/subscribeButton';
import useGetThumbnail from 'effects/use-get-thumbnail';
import { formatLbryUrlForWeb } from 'util/url';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  claim: ?Claim,
  resolveUri: string => void,
  isResolvingUri: boolean,
  history: { push: string => void },
  thumbnail: string,
  title: string,
  placeholder: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  blockedChannelUris: Array<string>,
  getFile: string => void,
  placeholder: boolean,
  streamingUrl: string,
};

function ClaimPreviewTile(props: Props) {
  const {
    history,
    uri,
    isResolvingUri,
    thumbnail,
    title,
    resolveUri,
    claim,
    placeholder,
    blackListedOutpoints,
    filteredOutpoints,
    getFile,
    streamingUrl,
  } = props;
  const shouldFetch = claim === undefined;
  const thumbnailUrl = useGetThumbnail(uri, claim, streamingUrl, getFile, placeholder) || thumbnail;
  const navigateUrl = uri ? formatLbryUrlForWeb(uri) : undefined;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;

  let isChannel;
  let isValid = false;
  if (uri) {
    try {
      ({ isChannel } = parseURI(uri));
      isValid = true;
    } catch (e) {
      isValid = false;
    }
  }

  const signingChannel = claim && claim.signing_channel;
  let channelThumbnail;
  if (signingChannel) {
    channelThumbnail =
      // I should be able to just pass the the uri to <ChannelThumbnail /> but it wasn't working
      // Come back to me
      (signingChannel.value && signingChannel.value.thumbnail && signingChannel.value.thumbnail.url) || undefined;
  }

  function handleClick(e) {
    if (navigateUrl) {
      history.push(navigateUrl);
    }
  }

  React.useEffect(() => {
    if (isValid && !isResolvingUri && shouldFetch && uri) {
      resolveUri(uri);
    }
  }, [isValid, isResolvingUri, uri, resolveUri, shouldFetch]);

  let shouldHide = false;

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

  if (shouldHide) {
    return null;
  }

  if (placeholder || isResolvingUri) {
    return (
      <li className={classnames('claim-preview--tile', {})}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-tile__title" />
          <div className="placeholder claim-tile__info" />
        </div>
      </li>
    );
  }

  return (
    <li
      role="link"
      onClick={handleClick}
      className={classnames('card claim-preview--tile', {
        'claim-preview--channel': isChannel,
      })}
    >
      <NavLink to={navigateUrl}>
        <FileThumbnail thumbnail={thumbnailUrl} />
      </NavLink>
      <NavLink to={navigateUrl}>
        <h2 className="claim-tile__title">
          <TruncatedText text={title} lines={2} />
        </h2>
      </NavLink>
      <div className="claim-tile__info">
        {isChannel ? (
          <div className="claim-tile__about--channel">
            <SubscribeButton uri={uri} />
            <span>
              {claimsInChannel === 1
                ? __('%claimsInChannel% publish', { claimsInChannel })
                : __('%claimsInChannel% publishes', { claimsInChannel })}
            </span>
          </div>
        ) : (
          <React.Fragment>
            <ChannelThumbnail thumbnailPreview={channelThumbnail} />

            <div className="claim-tile__about">
              <UriIndicator uri={uri} link />
              <DateTime timeAgo uri={uri} />
            </div>
          </React.Fragment>
        )}
      </div>
    </li>
  );
}

export default withRouter(ClaimPreviewTile);
