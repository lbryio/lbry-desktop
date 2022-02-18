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
  superchatsHidden?: boolean,
  noSuperchats?: boolean,
  isMobile?: boolean,
  hideChat?: () => void,
  setPopoutWindow?: (any) => void,
  toggleSuperchats?: () => void,
};

export default function LivestreamMenu(props: Props) {
  const {
    isPopoutWindow,
    superchatsHidden,
    noSuperchats,
    isMobile,
    hideChat,
    setPopoutWindow,
    toggleSuperchats,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const [showTimestamps, setShowTimestamps] = usePersistedState('live-timestamps', false);

  function handlePopout() {
    if (setPopoutWindow) {
      const newWindow = window.open('/$/popout' + pathname, 'Popout Chat', 'height=700,width=400');

      // Add function to newWindow when closed (either manually or from button component)
      newWindow.onbeforeunload = () => setPopoutWindow(undefined);

      if (window.focus) newWindow.focus();
      setPopoutWindow(newWindow);
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
          <MenuItem className="comment__menu-option" onSelect={() => setShowTimestamps(!showTimestamps)}>
            <span className="menu__link">
              <Icon aria-hidden icon={ICONS.TIME} />
              {__('Toggle Timestamps')}
            </span>
          </MenuItem>

          {!isMobile ? (
            <>
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
            !noSuperchats && (
              <MenuItem className="comment__menu-option" onSelect={toggleSuperchats}>
                <span className="menu__link">
                  <Icon aria-hidden icon={superchatsHidden ? ICONS.EYE : ICONS.DISMISS_ALL} size={18} />
                  {superchatsHidden ? __('Display HyperChats') : __('Dismiss HyperChats')}
                </span>
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
    </>
  );
}

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
