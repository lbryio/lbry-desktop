// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { MenuItem } from '@reach/menu-button';
import { parseURI } from 'util/lbryURI';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  notificationsDisabled: boolean,
  doToast: ({ message: string }) => void,
  doChannelSubscribe: (Subscription) => void,
};

export default function NotificationContentChannelMenu(props: Props) {
  const { uri, notificationsDisabled, doToast, doChannelSubscribe } = props;
  let claimName;
  const { claimName: name } = parseURI(uri);
  claimName = name || '';
  function handleClick() {
    doChannelSubscribe({
      uri,
      channelName: claimName,
      notificationsDisabled: !notificationsDisabled,
    });

    doToast({
      message: !notificationsDisabled
        ? __('Notifications turned off for %channel%.', { channel: claimName })
        : __('Notifications turned on for %channel%.', { channel: claimName }),
    });
  }

  return (
    <MenuItem onSelect={handleClick}>
      <div className="menu__link">
        <Icon aria-hidden icon={notificationsDisabled ? ICONS.BELL : ICONS.BELL_ON} />
        {notificationsDisabled ? __('Turn Back On') : __('Turn Off')}
      </div>
      <span className="menu__link-help">{claimName}</span>
    </MenuItem>
  );
}
