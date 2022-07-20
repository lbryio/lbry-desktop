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
import useGetUserMemberships from 'effects/use-get-user-memberships';
import PremiumBadge from 'component/premiumBadge';

type Props = {
  selectedChannelUrl: string, // currently selected channel
  channels: ?Array<ChannelClaim>,
  onChannelSelect?: (id: ?string) => void,
  hideAnon?: boolean,
  activeChannelClaim: ?ChannelClaim,
  doSetActiveChannel: (claimId: ?string, override?: boolean) => void,
  incognito: boolean,
  doSetIncognito: (boolean) => void,
  claimsByUri: { [string]: any },
  doFetchUserMemberships: (claimIdCsv: string) => void,
  odyseeMembershipByUri: (uri: string) => string,
  storeSelection?: boolean,
  doSetDefaultChannel: (claimId: string) => void,
  isHeaderMenu?: boolean,
  isPublishMenu?: boolean,
  isTabHeader?: boolean,
  autoSet?: boolean,
  channelToSet?: string,
  disabled?: boolean,
};

export default function ChannelSelector(props: Props) {
  const {
    channels,
    activeChannelClaim,
    doSetActiveChannel,
    onChannelSelect,
    incognito,
    doSetIncognito,
    odyseeMembershipByUri,
    claimsByUri,
    doFetchUserMemberships,
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

  function handleChannelSelect(channelClaim) {
    const { claim_id: id } = channelClaim;

    doSetIncognito(false);
    doSetActiveChannel(id);
    if (onChannelSelect) onChannelSelect(id);

    if (storeSelection) {
      doSetDefaultChannel(id);
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
              <ChannelListItem
                odyseeMembershipByUri={odyseeMembershipByUri}
                uri={activeChannelUrl}
                isSelected
                claimsByUri={claimsByUri}
                doFetchUserMemberships={doFetchUserMemberships}
                isPublishMenu={isPublishMenu}
                isTabHeader={isTabHeader}
              />
            )}
          </MenuButton>
        )}

        <MenuList
          className={classnames('menu__list channel__list', {
            'channel__list--publish': isPublishMenu,
            'channel__list--tabHeader': isTabHeader,
          })}
        >
          {channels &&
            channels.map((channel) => (
              <MenuItem key={channel.permanent_url} onSelect={() => handleChannelSelect(channel)}>
                <ChannelListItem
                  odyseeMembershipByUri={odyseeMembershipByUri}
                  uri={channel.permanent_url}
                  claimsByUri={claimsByUri}
                  doFetchUserMemberships={doFetchUserMemberships}
                  isPublishMenu={isPublishMenu}
                  isTabHeader={isTabHeader}
                />
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

type ListItemProps = {
  uri: string,
  isSelected?: boolean,
  claimsByUri: { [string]: any },
  doFetchUserMemberships: (claimIdCsv: string) => void,
  odyseeMembershipByUri: (uri: string) => string,
  isPublishMenu?: boolean,
  isTabHeader?: boolean,
};

function ChannelListItem(props: ListItemProps) {
  const { uri, isSelected = false, claimsByUri, doFetchUserMemberships } = props;

  const shouldFetchUserMemberships = true;
  useGetUserMemberships(shouldFetchUserMemberships, [uri], claimsByUri, doFetchUserMemberships, [uri]);

  return (
    <div
      className={classnames('channel__list-item', {
        'channel__list-item--selected': isSelected,
      })}
    >
      <ChannelThumbnail uri={uri} hideStakedIndicator xsmall noLazyLoad />
      <ChannelTitle uri={uri} />
      <PremiumBadge uri={uri} />
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
