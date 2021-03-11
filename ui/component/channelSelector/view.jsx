// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import classnames from 'classnames';
import React from 'react';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import ChannelTitle from 'component/channelTitle';
import Icon from 'component/common/icon';
import { useHistory } from 'react-router';

type Props = {
  selectedChannelUrl: string, // currently selected channel
  channels: ?Array<ChannelClaim>,
  onChannelSelect: (url: string) => void,
  hideAnon?: boolean,
  activeChannelClaim: ?ChannelClaim,
  doSetActiveChannel: (string) => void,
  incognito: boolean,
  doSetIncognito: (boolean) => void,
};

type ListItemProps = {
  uri: string,
  isSelected?: boolean,
};

function ChannelListItem(props: ListItemProps) {
  const { uri, isSelected = false } = props;

  return (
    <div className={classnames('channel__list-item', { 'channel__list-item--selected': isSelected })}>
      <ChannelThumbnail uri={uri} hideStakedIndicator />
      <ChannelTitle uri={uri} />
      {isSelected && <Icon icon={ICONS.DOWN} />}
    </div>
  );
}

type IncognitoSelectorProps = {
  isSelected?: boolean,
};

function IncognitoSelector(props: IncognitoSelectorProps) {
  return (
    <div className={classnames('channel__list-item', { 'channel__list-item--selected': props.isSelected })}>
      <Icon sectionIcon icon={ICONS.ANONYMOUS} />
      <h2 className="channel__list-text">{__('Anonymous')}</h2>
      {props.isSelected && <Icon icon={ICONS.DOWN} />}
    </div>
  );
}

function ChannelSelector(props: Props) {
  const { channels, activeChannelClaim, doSetActiveChannel, hideAnon = false, incognito, doSetIncognito } = props;
  const {
    push,
    location: { pathname },
  } = useHistory();
  const activeChannelUrl = activeChannelClaim && activeChannelClaim.permanent_url;

  function handleChannelSelect(channelClaim) {
    doSetIncognito(false);
    doSetActiveChannel(channelClaim.claim_id);
  }

  return (
    <div className="channel__selector">
      <Menu>
        <MenuButton>
          {(incognito && !hideAnon) || !activeChannelUrl ? (
            <IncognitoSelector isSelected />
          ) : (
            <ChannelListItem uri={activeChannelUrl} isSelected />
          )}
        </MenuButton>
        <MenuList className="menu__list channel__list">
          {channels &&
            channels.map((channel) => (
              <MenuItem key={channel.permanent_url} onSelect={() => handleChannelSelect(channel)}>
                <ChannelListItem uri={channel.permanent_url} />
              </MenuItem>
            ))}
          {!hideAnon && (
            <MenuItem onSelect={() => doSetIncognito(true)}>
              <IncognitoSelector />
            </MenuItem>
          )}
          <MenuItem onSelect={() => push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`)}>
            <div className="channel__list-item">
              <Icon sectionIcon icon={ICONS.CHANNEL} />
              <h2 className="channel__list-text">{__('Create a new channel')}</h2>
            </div>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default ChannelSelector;
