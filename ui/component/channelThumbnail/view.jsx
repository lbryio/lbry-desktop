// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Spaceman from './spaceman.png';
import Transparent from './transparent_1x1.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';
import ChannelStakedIndicator from 'component/channelStakedIndicator';
import { getThumbnailCdnUrl } from 'util/thumbnail';
import useLazyLoading from 'effects/use-lazy-loading';

type Props = {
  thumbnail: ?string,
  uri: ?string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
  allowGifs?: boolean,
  claim: ?ChannelClaim,
  doResolveUri: (string) => void,
  isResolving: boolean,
  showDelayedMessage?: boolean,
  hideStakedIndicator?: boolean,
  xsmall?: boolean,
  noOptimization?: boolean,
};

function ChannelThumbnail(props: Props) {
  const {
    thumbnail: rawThumbnail,
    uri,
    className,
    thumbnailPreview: rawThumbnailPreview,
    obscure,
    small = false,
    xsmall = false,
    allowGifs = false,
    claim,
    doResolveUri,
    isResolving,
    showDelayedMessage = false,
    hideStakedIndicator = false,
    noOptimization,
  } = props;
  const [thumbError, setThumbError] = React.useState(false);
  const shouldResolve = claim === undefined;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, 'https://');
  const channelThumbnail = thumbnail || thumbnailPreview;
  const isGif = channelThumbnail && channelThumbnail.endsWith('gif');
  const showThumb = (!obscure && !!thumbnail) || thumbnailPreview;
  const thumbnailRef = React.useRef(null);
  // Generate a random color class based on the first letter of the channel name
  const { channelName } = parseURI(uri);
  let initializer;
  let colorClassName;
  if (channelName) {
    initializer = channelName.charCodeAt(0) - 65; // will be between 0 and 57
    colorClassName = `channel-thumbnail__default--${Math.abs(initializer % 4)}`;
  } else {
    colorClassName = `channel-thumbnail__default--4`;
  }

  React.useEffect(() => {
    if (shouldResolve && uri) {
      doResolveUri(uri);
    }
  }, [doResolveUri, shouldResolve, uri]);

  useLazyLoading(thumbnailRef, 0.25, [showThumb, thumbError, channelThumbnail]);

  if (isGif && !allowGifs) {
    return (
      <FreezeframeWrapper src={channelThumbnail} className={classnames('channel-thumbnail', className)}>
        {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
      </FreezeframeWrapper>
    );
  }

  let url = channelThumbnail;
  // @if TARGET='web'
  // Pass image urls through a compression proxy, except for GIFs.
  if (thumbnail && !noOptimization && !(isGif && allowGifs)) {
    url = getThumbnailCdnUrl({ thumbnail });
  }
  // @endif

  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !showThumb,
        'channel-thumbnail--small': small,
        'channel-thumbnail--xsmall': xsmall,
        'channel-thumbnail--resolving': isResolving,
      })}
    >
      {!showThumb && (
        <img
          ref={thumbnailRef}
          alt={__('Channel profile picture')}
          className="channel-thumbnail__default"
          data-src={!thumbError && url ? url : Spaceman}
          src={Transparent}
          onError={() => setThumbError(true)} // if thumb fails (including due to https replace, show gerbil.
        />
      )}
      {showThumb && (
        <>
          {showDelayedMessage && thumbError ? (
            <div className="chanel-thumbnail--waiting">{__('This will be visible in a few minutes.')}</div>
          ) : (
            <img
              ref={thumbnailRef}
              alt={__('Channel profile picture')}
              className="channel-thumbnail__custom"
              data-src={!thumbError && url ? url : Spaceman}
              src={Transparent}
              onError={() => setThumbError(true)} // if thumb fails (including due to https replace, show gerbil.
            />
          )}
        </>
      )}
      {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
    </div>
  );
}

export default ChannelThumbnail;
