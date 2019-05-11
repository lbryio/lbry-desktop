// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';

type Props = {
  thumbnail: ?string,
  uri: string,
};

function ChannelThumbnail(props: Props) {
  const { thumbnail, uri } = props;

  function getColorClass() {
    // Generate a random color class based on the first letter of the channel name
    const { channelName } = parseURI(uri);
    const initializer = channelName.charCodeAt(0) - 65; // will be between 0 and 57

    let thumbnailColorClass = `channel-thumbnail__default--`;

    switch (true) {
      case initializer < 15:
        return (thumbnailColorClass += '1');
      case initializer < 30:
        return (thumbnailColorClass += '2');
      case initializer < 45:
        return (thumbnailColorClass += '3');
      default:
        return (thumbnailColorClass += '4');
    }
  }

  return (
    <div
      className={classnames('channel-thumbnail', {
        [getColorClass()]: !thumbnail,
      })}
    >
      {!thumbnail && <img className="channel-thumbnail__default" src={Gerbil} />}
      {thumbnail && <img className="channel-thumbnail__custom" src={thumbnail} />}
    </div>
  );
}

export default ChannelThumbnail;
