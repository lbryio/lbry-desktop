// @flow
import * as ICONS from 'constants/icons';
import classnames from 'classnames';
import React from 'react';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import ClaimPreviewTitle from 'component/claimPreviewTitle';
import Icon from 'component/common/icon';

type Props = {
  selectedChannelUrl: string, // currently selected channel
  channels: ?Array<ChannelClaim>,
  onChannelSelect: (url: string) => void,
};

type ListItemProps = {
  url: string,
  isSelected?: boolean,
};

function ChannelListItem(props: ListItemProps) {
  const { url, isSelected = false } = props;

  return (
    <div className={classnames('channel__list-item', { 'channel__list-item--selected': isSelected })}>
      <ChannelThumbnail uri={url} />
      <ClaimPreviewTitle uri={url} />
      {isSelected && <Icon icon={ICONS.DOWN} />}
    </div>
  );
}

function ChannelSelector(props: Props) {
  const { channels, selectedChannelUrl, onChannelSelect } = props;

  if (!selectedChannelUrl) {
    return null;
  }

  return (
    <div>
      <Menu>
        <MenuButton className="">
          <ChannelListItem url={selectedChannelUrl} isSelected />
        </MenuButton>
        <MenuList className="menu__list">
          {channels &&
            channels.map(channel => (
              <MenuItem key={channel.canonical_url} onSelect={() => onChannelSelect(channel.canonical_url)}>
                <ChannelListItem url={channel.canonical_url} />
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </div>
  );
}

export default ChannelSelector;
