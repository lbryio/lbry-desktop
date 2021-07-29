// @flow
import React from 'react';

type Props = {
  claim: ?StreamClaim,
  className?: string,
};

function VideoDuration(props: Props) {
  const { claim, className } = props;

  const video = claim && claim.value && (claim.value.video || claim.value.audio);
  let duration;
  if (video && video.duration) {
    // $FlowFixMe
    let date = new Date(null);
    date.setSeconds(video.duration);
    let timeString = date.toISOString().substr(11, 8);

    if (timeString.startsWith('00:')) {
      timeString = timeString.substr(3);
    }

    duration = timeString;
  }

  return duration ? <span className={className}>{duration}</span> : null;
}

export default VideoDuration;
