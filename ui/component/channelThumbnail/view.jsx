// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';
import ChannelStakedIndicator from 'component/channelStakedIndicator';
import { getThumbnailCdnUrl } from 'util/thumbnail';

const FONT_PX = 16.0;
const IMG_XSMALL_REM = 2.1;
const IMG_SMALL_REM = 3.0;
const IMG_NORMAL_REM = 10.0;

type Props = {
  thumbnail: ?string,
  uri: ?string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
  xsmall?: boolean,
  allowGifs?: boolean,
  claim: ?ChannelClaim,
  doResolveUri: (string) => void,
  isResolving: boolean,
  showDelayedMessage?: boolean,
  noLazyLoad?: boolean,
  hideStakedIndicator?: boolean,
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
    noLazyLoad,
    hideStakedIndicator = false,
  } = props;
  const [thumbError, setThumbError] = React.useState(false);
  const shouldResolve = claim === undefined;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, 'https://');
  const channelThumbnail = thumbnail || thumbnailPreview;
  const isGif = channelThumbnail && channelThumbnail.endsWith('gif');
  const showThumb = (!obscure && !!thumbnail) || thumbnailPreview;
  const thumbnailRef = React.useRef(null);
  const thumbnailSize = calcRenderedImgWidth(); // currently always 1:1

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

  function calcRenderedImgWidth() {
    let rem;
    if (xsmall) {
      rem = IMG_XSMALL_REM;
    } else if (small) {
      rem = IMG_SMALL_REM;
    } else {
      rem = IMG_NORMAL_REM;
    }

    const devicePixelRatio = window.devicePixelRatio || 1.0;
    return Math.ceil(rem * devicePixelRatio * FONT_PX);
  }

  React.useEffect(() => {
    if (shouldResolve && uri) {
      doResolveUri(uri);
    }
  }, [doResolveUri, shouldResolve, uri]);

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
  if (thumbnail && !(isGif && allowGifs)) {
    url = getThumbnailCdnUrl({ thumbnail, width: thumbnailSize, height: thumbnailSize, quality: 85 });
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
          src={!thumbError && url ? url : Gerbil}
          width={thumbnailSize}
          height={thumbnailSize}
          loading={noLazyLoad ? undefined : 'lazy'}
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
              src={!thumbError && url ? url : Gerbil}
              width={thumbnailSize}
              height={thumbnailSize}
              loading={noLazyLoad ? undefined : 'lazy'}
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
