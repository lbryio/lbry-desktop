// @flow
// $FlowFixMe
import { Global } from '@emotion/react';

import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { useHistory } from 'react-router-dom';
import usePersistedState from 'effects/use-persisted-state';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import React from 'react';

type Props = {
  isPopoutWindow?: boolean,
  hyperchatsHidden?: boolean,
  noHyperchats?: boolean,
  isMobile?: boolean,
  isCompact?: boolean,
  hideChat?: () => void,
  setPopoutWindow?: (any) => void,
  toggleHyperchats?: () => void,
  toggleIsCompact?: () => void,
  // -- redux --
  claimId: ?string,
  claimIsMine: boolean,
  channelHasMembershipTiers: boolean,
  isLivestreamChatMembersOnly?: boolean,
  doToggleLiveChatMembersOnlySettingForClaimId: (claimId: ClaimId) => Promise<any>,
  doToast: ({ message: string }) => void,
};

const LivestreamMenu = (props: Props) => {
  const {
    hideChat,
    hyperchatsHidden,
    isCompact,
    isMobile,
    isPopoutWindow,
    noHyperchats,
    setPopoutWindow,
    toggleHyperchats,
    toggleIsCompact,
    // -- redux --
    claimId,
    claimIsMine,
    channelHasMembershipTiers,
    isLivestreamChatMembersOnly,
    doToggleLiveChatMembersOnlySettingForClaimId,
    doToast,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const initialPopoutUnload = React.useRef(false);

  const [showTimestamps, setShowTimestamps] = usePersistedState('live-timestamps', false);

  function updateLivestreamMembersOnlyChat() {
    if (claimId) {
      doToggleLiveChatMembersOnlySettingForClaimId(claimId).then(() =>
        doToast({
          message: __(
            isLivestreamChatMembersOnly ? 'Members-only chat is now disabled.' : 'Members-only chat is now enabled.'
          ),
        })
      );
    }
  }

  function handlePopout() {
    if (setPopoutWindow) {
      const popoutWindow = window.open('/$/popout' + pathname, 'Popout Chat', 'height=700,width=400');

      // Adds function to popoutWindow when unloaded and verify if it was closed
      const handleUnload = (e) => {
        if (!initialPopoutUnload.current) {
          initialPopoutUnload.current = true;
        } else {
          const timer = setInterval((a, b) => {
            if (popoutWindow.closed) {
              clearInterval(timer);
              setPopoutWindow(undefined);
            }
          }, 300);
        }
      };

      popoutWindow.onunload = handleUnload;

      if (window.focus) popoutWindow.focus();
      setPopoutWindow(popoutWindow);
    }
  }

  return (
    <>
      <MenuGlobalStyles showTimestamps={showTimestamps} />

      <Menu>
        <MenuButton className="menu__button">
          <Icon size={isMobile ? 16 : 18} icon={ICONS.SETTINGS} />
        </MenuButton>

        <MenuList className="menu__list">
          {channelHasMembershipTiers && claimIsMine && (
            <MenuItem className="comment__menu-option" onSelect={() => updateLivestreamMembersOnlyChat()}>
              <span className="menu__link">
                <Icon aria-hidden icon={ICONS.MEMBERSHIP} />
                {__(isLivestreamChatMembersOnly ? 'Disable Members-Only Chat' : 'Enable Members-Only Chat')}
              </span>
            </MenuItem>
          )}
          <MenuItem className="comment__menu-option" onSelect={() => setShowTimestamps(!showTimestamps)}>
            <span className="menu__link">
              <Icon aria-hidden icon={ICONS.TIME} />
              {__('Toggle Timestamps')}
            </span>
          </MenuItem>
          <MenuItem className="comment__menu-option" onSelect={toggleIsCompact}>
            <span className="menu__link">
              <Icon aria-hidden icon={!isCompact ? ICONS.COMPACT : ICONS.EXPAND} size={18} />
              {!isCompact ? __('Enable Compact Mode') : __('Disable Compact Mode')}
            </span>
          </MenuItem>

          {!isMobile ? (
            <>
              {!noHyperchats && (
                <MenuItem className="comment__menu-option" onSelect={toggleHyperchats}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={hyperchatsHidden ? ICONS.EYE : ICONS.DISMISS_ALL} size={18} />
                    {hyperchatsHidden ? __('Display HyperChats') : __('Dismiss HyperChats')}
                  </span>
                </MenuItem>
              )}
              {/* No need for Hide Chat on mobile with the expand/collapse drawer */}
              <MenuItem className="comment__menu-option" onSelect={hideChat}>
                <span className="menu__link">
                  <Icon aria-hidden icon={ICONS.EYE} />
                  {__('Hide Chat')}
                </span>
              </MenuItem>

              {!isPopoutWindow && (
                <MenuItem className="comment__menu-option" onSelect={handlePopout}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={ICONS.EXTERNAL} />
                    {__('Popout Chat')}
                  </span>
                </MenuItem>
              )}
            </>
          ) : (
            !noHyperchats && (
              <MenuItem className="comment__menu-option" onSelect={toggleHyperchats}>
                <span className="menu__link">
                  <Icon aria-hidden icon={hyperchatsHidden ? ICONS.EYE : ICONS.DISMISS_ALL} size={18} />
                  {hyperchatsHidden ? __('Display HyperChats') : __('Dismiss HyperChats')}
                </span>
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default LivestreamMenu;

type GlobalStylesProps = {
  showTimestamps?: boolean,
};

const MenuGlobalStyles = (globalStylesProps: GlobalStylesProps) => {
  const { showTimestamps } = globalStylesProps;

  return (
    <Global
      styles={{
        ':root': {
          '--live-timestamp-opacity': showTimestamps ? '0.5' : '0',
        },
      }}
    />
  );
};
