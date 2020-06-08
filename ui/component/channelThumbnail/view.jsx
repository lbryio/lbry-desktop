// @flow
import React, { useState } from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';
import FreezeframeWrapper from 'component/fileThumbnail/FreezeframeWrapper';

type Props = {
  thumbnail: ?string,
  uri: ?string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
  allowGifs?: boolean,
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
  } = props;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, 'https://');
  const channelThumbnail = thumbnail || thumbnailPreview;

  const [thumbError, setThumbError] = useState(false);
  if (channelThumbnail && channelThumbnail.endsWith('gif') && !allowGifs) {
    return <FreezeframeWrapper src={channelThumbnail} className="channel-thumbnail" />;
  }

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
  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !showThumb,
        'channel-thumbnail--small': small,
      })}
    >
      {!showThumb && (
        <img
          alt={__('Channel profile picture')}
          className="channel-thumbnail__default"
          src={thumbnailPreview || Gerbil}
        />
      )}
      {showThumb && (
        <img
          alt={__('Channel profile picture')}
          className="channel-thumbnail__custom"
          src={!thumbError ? thumbnailPreview || thumbnail : Gerbil}
          onError={() => setThumbError(true)} // if thumb fails (including due to https replace, show gerbil.
        />
      )}
    </div>
  );
}

export default ChannelThumbnail;
