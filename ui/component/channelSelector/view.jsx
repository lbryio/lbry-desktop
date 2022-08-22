// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import classnames from 'classnames';
import React from 'react';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import { useHistory } from 'react-router';
import IncognitoSelector from './internal/incognito-selector';
import ChannelListItem from './internal/channelListItem';

type Props = {
  selectedChannelUrl: string, // currently selected channel
  channelIds: ?ClaimIds,
  onChannelSelect?: (id: ?string) => void,
  hideAnon?: boolean,
  activeChannelClaim: ?ChannelClaim,
  doSetActiveChannel: (claimId: ?string, override?: boolean) => void,
  incognito: boolean,
  doSetIncognito: (boolean) => void,
  storeSelection?: boolean,
  doSetDefaultChannel: (claimId: string) => void,
  isHeaderMenu?: boolean,
  isPublishMenu?: boolean,
  isTabHeader?: boolean,
  autoSet?: boolean,
  channelToSet?: string,
  disabled?: boolean,
};

function ChannelSelector(props: Props) {
  const {
    channelIds,
    activeChannelClaim,
    doSetActiveChannel,
    onChannelSelect,
    incognito,
    doSetIncognito,
    storeSelection,
    doSetDefaultChannel,
    isHeaderMenu,
    isPublishMenu,
    isTabHeader,
    autoSet,
    channelToSet,
    disabled,
  } = props;

  const hideAnon = Boolean(props.hideAnon || storeSelection);

  const {
    push,
    location: { pathname },
  } = useHistory();

  const activeChannelUrl = activeChannelClaim && activeChannelClaim.permanent_url;
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

  function handleChannelSelect(channelId) {
    doSetIncognito(false);
    doSetActiveChannel(channelId);
    if (onChannelSelect) onChannelSelect(channelId);

    if (storeSelection) {
      doSetDefaultChannel(channelId);
    }
  }

  React.useEffect(() => {
    if (!autoSet) return;

    if (channelToSet) {
      doSetActiveChannel(channelToSet);
      doSetIncognito(false);
    } else if (!channelToSet) {
      doSetIncognito(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- On mount if we get to autoSet a channel, set it.
  }, []);

  return (
    <div
      className={classnames('channel__selector', {
        'channel__selector--publish': isPublishMenu,
        'channel__selector--tabHeader': isTabHeader,
        disabled: disabled,
      })}
    >
      <Menu>
        {isHeaderMenu ? (
          <MenuButton className="menu__link">
            <ChannelThumbnail uri={activeChannelUrl} hideStakedIndicator xxsmall noLazyLoad />
            {__('Change Default Channel')}
            <Icon icon={ICONS.DOWN} />
          </MenuButton>
        ) : (
          <MenuButton>
            {(incognito && !hideAnon) || !activeChannelUrl ? (
              <IncognitoSelector isSelected />
            ) : (
              <ChannelListItem channelId={activeChannelId} isSelected />
            )}
          </MenuButton>
        )}

        <MenuList className="menu__list channel__list">
          {channelIds &&
            channelIds.map((channelId) => (
              <MenuItem key={channelId} onSelect={() => handleChannelSelect(channelId)}>
                <ChannelListItem channelId={channelId} />
              </MenuItem>
            ))}

          {!hideAnon && (
            <MenuItem
              onSelect={() => {
                doSetIncognito(true);
                if (onChannelSelect) onChannelSelect(undefined);
              }}
            >
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
