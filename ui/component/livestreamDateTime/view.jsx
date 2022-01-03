// @flow
import React from 'react';
import DateTime from 'component/dateTime';
import { LIVESTREAM_STARTED_RECENTLY_BUFFER } from 'constants/livestream';
import moment from 'moment';

type Props = {
  uri: string,
  claim: any,
  activeLivestream: any,
};

const LivestreamDateTime = (props: Props) => {
  const { uri, claim, activeLivestream } = props;

  if (activeLivestream) {
    return (
      <span>
        {__('Started')} <DateTime timeAgo date={activeLivestream.startedStreaming.toDate()} />
      </span>
    );
  }
  if (
    moment
      .unix(claim.value.release_time)
      .isBetween(moment().subtract(LIVESTREAM_STARTED_RECENTLY_BUFFER, 'minutes'), moment())
  ) {
    return __('Starting Soon');
  }
  return (
    <span>
      {__('Live')} <DateTime timeAgo uri={uri} showFutureDate />
    </span>
  );
};

export default LivestreamDateTime;
