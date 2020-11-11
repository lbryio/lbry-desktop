// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Spaceman from './spaceman.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';

type Props = {
  thumbnail: ?string,
  uri: ?string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
  allowGifs?: boolean,
  claim: ?ChannelClaim,
  doResolveUri: string => void,
  isResolving: boolean,
};

function ChannelThumbnail(props: Props) {
  const {
    thumbnail: rawThumbnail,
    uri,
    className,
    thumbnailPreview: rawThumbnailPreview,
    obscure,
    small = false,
    allowGifs = false,
    claim,
    doResolveUri,
    isResolving,
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
    return <FreezeframeWrapper src={channelThumbnail} className={classnames('channel-thumbnail', className)} />;
  }

  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !showThumb,
        'channel-thumbnail--small': small,
        'channel-thumbnail--resolving': isResolving,
      })}
    >
      {!showThumb && (
        <img
          alt={__('Channel profile picture')}
          className="channel-thumbnail__default"
          src={thumbnailPreview || Spaceman}
        />
      )}
      {showThumb && (
        <img
          alt={__('Channel profile picture')}
          className="channel-thumbnail__custom"
          src={!thumbError ? thumbnailPreview || thumbnail : Spaceman}
          onError={() => setThumbError(true)} // if thumb fails (including due to https replace, show gerbil.
        />
      )}
    </div>
  );
}

export default ChannelThumbnail;
