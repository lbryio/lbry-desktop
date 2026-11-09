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
// @ts-expect-error - TS2554 - Expected 2 arguments, but got 1.
    duration = formatMediaDuration(media.duration);
  }

  return duration ? <span className={className}>{duration}</span> : null;
}

export default VideoDuration;
