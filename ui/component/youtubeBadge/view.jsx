// @flow
import * as React from 'react';
import { getTimeAgoStr } from 'util/time';
import { Lbryio } from 'lbryinc';

type Props = {
  channelClaimId: string,
};

export default function YoutubeBadge(props: Props) {
  const { channelClaimId } = props;
  const [isVerified, setIsVerified] = React.useState();
  const [lastYtSyncDate, setLastYtSyncDate] = React.useState();

  React.useEffect(() => {
    if (channelClaimId) {
      Lbryio.call('yt', 'get_youtuber', { channel_claim_id: channelClaimId }).then((response) => {
        if (response.is_verified_youtuber) {
          setIsVerified(true);
          setLastYtSyncDate(response.last_synced);
        } else {
          setIsVerified(false);
          setLastYtSyncDate(undefined);
        }
      });
    } else {
      setIsVerified(false);
      setLastYtSyncDate(undefined);
    }
  }, [channelClaimId]);

  if (isVerified) {
    return (
      <>
        <label>{__('Official YouTube Creator')}</label>
        <div className="media__info-text">
          <div className="media__info-text media__info-text--constrained">
            {lastYtSyncDate && __('Last checked %time_ago%', { time_ago: getTimeAgoStr(lastYtSyncDate) })}
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
