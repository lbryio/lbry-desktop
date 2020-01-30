// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';

type Props = {
  thumbnail: ?string,
  uri: ?string,
  className?: string,
  thumbnailPreview: ?string,
  obscure?: boolean,
  small?: boolean,
};

function ChannelThumbnail(props: Props) {
  const { thumbnail, uri, className, thumbnailPreview, obscure, small = false } = props;
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
          src={thumbnailPreview || thumbnail}
        />
      )}
    </div>
  );
}

export default ChannelThumbnail;
