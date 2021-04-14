// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Spaceman from './spaceman.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';
import ChannelStakedIndicator from 'component/channelStakedIndicator';

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
  } = props;
  const [thumbError, setThumbError] = React.useState(false);
  const shouldResolve = claim === undefined;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, 'https://');
  const channelThumbnail = thumbnail || thumbnailPreview;
  const showThumb = (!obscure && !!thumbnail) || thumbnailPreview;
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

  if (channelThumbnail && channelThumbnail.endsWith('gif') && !allowGifs) {
    return (
      <FreezeframeWrapper src={channelThumbnail} className={classnames('channel-thumbnail', className)}>
        {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
      </FreezeframeWrapper>
    );
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
      {!showThumb && (
        <img
          alt={__('Channel profile picture')}
          className="channel-thumbnail__default"
          src={!thumbError && thumbnailPreview ? thumbnailPreview : Spaceman}
          onError={() => setThumbError(true)} // if thumb fails (including due to https replace, show gerbil.
        />
      )}
      {showThumb && (
        <>
          {showDelayedMessage && thumbError ? (
            <div className="chanel-thumbnail--waiting">{__('This will be visible in a few minutes.')}</div>
          ) : (
            <img
              alt={__('Channel profile picture')}
              className="channel-thumbnail__custom"
              src={!thumbError ? thumbnailPreview || thumbnail : Spaceman}
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
