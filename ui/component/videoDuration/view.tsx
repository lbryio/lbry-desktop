import React from 'react';
import formatMediaDuration from 'util/formatMediaDuration';
type Props = {
  claim: StreamClaim | null | undefined,
  className?: string
};

function VideoDuration(props: Props) {
  const { claim, className } = props;

  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  let duration;
  if (media && media.duration) {
    duration = formatMediaDuration(media.duration);
  }

  return duration ? <span className={className}>{duration}</span> : null;
}

export default VideoDuration;
