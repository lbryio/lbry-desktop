// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import DateTime from 'component/dateTime';
import Icon from 'component/common/icon';
import { Lbryio } from 'lbryinc';

type Props = {
  channelClaimId: string,
  includeSyncDate: boolean,
};

export default function YoutubeBadge(props: Props) {
  const { channelClaimId, includeSyncDate = true } = props;

  const [isVerified, setIsVerified] = React.useState();
  const [lastYtSyncDate, setLastYtSyncDate] = React.useState();

  React.useEffect(() => {
    if (channelClaimId) {
      Lbryio.call('yt', 'get_youtuber', { channel_claim_id: channelClaimId }).then(response => {
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
    const str =
      includeSyncDate && lastYtSyncDate
        ? __('Official YouTube Creator - Last checked %time_ago%', { time_ago: DateTime.getTimeAgoStr(lastYtSyncDate) })
        : __('Official YouTube Creator');
    return (
      <div className="media__uri--right">
        <Icon icon={ICONS.VALIDATED} size={12} />
        {str}
      </div>
    );
  } else {
    return null;
  }
}
