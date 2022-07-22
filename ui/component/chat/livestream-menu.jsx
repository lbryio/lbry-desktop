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
  noSuperchats?: boolean,
  isMobile?: boolean,
  hideChat?: () => void,
  setPopoutWindow?: (any) => void,
  toggleHyperchats?: () => void,
  toggleFastMode?: () => void,
};

export default function LivestreamMenu(props: Props) {
  const {
    isPopoutWindow,
    hyperchatsHidden,
    noSuperchats,
    isMobile,
    hideChat,
    setPopoutWindow,
    toggleHyperchats,
    toggleFastMode,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const initialPopoutUnload = React.useRef(false);

  const [showTimestamps, setShowTimestamps] = usePersistedState('live-timestamps', false);

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

  const DEV = false;
  const fastModeEnabled = true;
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
              {!noSuperchats && (
                <MenuItem className="comment__menu-option" onSelect={toggleHyperchats}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={hyperchatsHidden ? ICONS.EYE : ICONS.DISMISS_ALL} size={18} />
                    {hyperchatsHidden ? __('Display HyperChats') : __('Dismiss HyperChats')}
                  </span>
                </MenuItem>
              )}
              {DEV && (
                <MenuItem className="comment__menu-option" onSelect={toggleFastMode}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={fastModeEnabled ? ICONS.EYE : ICONS.DISMISS_ALL} size={18} />
                    {!fastModeEnabled ? __('Enable Fast Mode') : __('Disable Fast Mode')}
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
            !noSuperchats && (
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
