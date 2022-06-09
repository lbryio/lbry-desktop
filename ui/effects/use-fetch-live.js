// @flow
import React from 'react';
import { LIVESTREAM_STATUS_CHECK_INTERVAL_SOON, LIVESTREAM_STATUS_CHECK_INTERVAL } from 'constants/livestream';

export default function useFetchLiveStatus(
  channelClaimId: ?string,
  doFetchChannelLiveStatus: (string) => void,
  poll?: boolean,
  fasterPoll?: boolean
) {
  // Find out current channels status + active live claim every 30 seconds
  React.useEffect(() => {
    if (!channelClaimId) return;

    const fetch = () => doFetchChannelLiveStatus(channelClaimId || '');

    fetch();

    if (poll) {
      const interval = fasterPoll ? LIVESTREAM_STATUS_CHECK_INTERVAL_SOON : LIVESTREAM_STATUS_CHECK_INTERVAL;
      const intervalId = setInterval(fetch, interval);

      return () => clearInterval(intervalId);
    }
  }, [channelClaimId, doFetchChannelLiveStatus, fasterPoll, poll]);
}
