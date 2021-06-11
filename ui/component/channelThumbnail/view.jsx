// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';
import ChannelStakedIndicator from 'component/channelStakedIndicator';
import OptimizedImage from 'component/optimizedImage';
import { AVATAR_DEFAULT } from 'config';
import ThumbnailBrokenImage from './thumbnail-broken.png';

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
  const defaultAvater = AVATAR_DEFAULT || Gerbil;

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

  if (isGif && !allowGifs) {
    return (
      <FreezeframeWrapper src={channelThumbnail} className={classnames('channel-thumbnail', className)}>
        {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
      </FreezeframeWrapper>
    );
  }

  let thumbnailSrc;
  if (!channelThumbnail) {
    thumbnailSrc = defaultAvater;
  } else if (thumbError) {
    thumbnailSrc = ThumbnailBrokenImage;
  } else {
    thumbnailSrc = channelThumbnail;
  }

  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !showThumb,
        'channel-thumbnail--small': small,
        'channel-thumbnail--xsmall': xsmall,
        'channel-thumbnail--resolving': isResolving,
      })}
    >
      {showDelayedMessage ? (
        <div className="channel-thumbnail--waiting">{__('This will be visible in a few minutes.')}</div>
        ) : (
        <OptimizedImage
          alt={__('Channel profile picture')}
          className={!channelThumbnail ? 'channel-thumbnail__default' : 'channel-thumbnail__custom'}
          src={thumbnailSrc}
          loading={noLazyLoad ? undefined : 'lazy'}
          onError={() => setThumbError(true)}
          onLoad={() => thumbnailSrc !== ThumbnailBrokenImage && setThumbError(false)}
        />
      )}
      {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
    </div>
  );
}

export default ChannelThumbnail;
