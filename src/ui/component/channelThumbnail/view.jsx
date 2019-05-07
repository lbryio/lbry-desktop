// @flow
import React from 'react';

type Props = {
  thumbnail: ?string,
};

function ChannelThumbnail(props: Props) {
  const { thumbnail } = props;
  return (
    <div className="channel__thumbnail">
      {thumbnail && <img className="channel__thumbnail--custom" src={thumbnail} />}
    </div>
  );
}

export default ChannelThumbnail;
