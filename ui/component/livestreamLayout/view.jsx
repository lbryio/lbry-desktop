// @flow
import 'scss/component/_swipeable-drawer.scss';

import { lazyImport } from 'util/lazyImport';
import { useIsMobile } from 'effects/use-screensize';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import FileTitleSection from 'component/fileTitleSection';
import LivestreamLink from 'component/livestreamLink';
import React from 'react';
import { PRIMARY_PLAYER_WRAPPER_CLASS } from 'page/file/view';
import FileRenderInitiator from 'component/fileRenderInitiator';
import LivestreamIframeRender from './iframe-render';
import * as ICONS from 'constants/icons';
import SwipeableDrawer from 'component/swipeableDrawer';
import { DrawerExpandButton } from 'component/swipeableDrawer/view';
import LivestreamMenu from 'component/livestreamChatLayout/livestream-menu';
import Icon from 'component/common/icon';
import CreditAmount from 'component/common/credit-amount';
import { getTipValues } from 'util/livestream';

const LivestreamChatLayout = lazyImport(() => import('component/livestreamChatLayout' /* webpackChunkName: "chat" */));

const VIEW_MODES = {
  CHAT: 'chat',
  SUPERCHAT: 'sc',
};

type Props = {
  activeStreamUri: boolean | string,
  claim: ?StreamClaim,
  hideComments: boolean,
  isCurrentClaimLive: boolean,
  release: any,
  showLivestream: boolean,
  showScheduledInfo: boolean,
  uri: string,
  superChats: Array<Comment>,
};

export default function LivestreamLayout(props: Props) {
  const {
    activeStreamUri,
    claim,
    hideComments,
    isCurrentClaimLive,
    release,
    showLivestream,
    showScheduledInfo,
    uri,
    superChats,
  } = props;

  const isMobile = useIsMobile();

  const [showChat, setShowChat] = React.useState(undefined);
  const [superchatsHidden, setSuperchatsHidden] = React.useState(false);
  const [chatViewMode, setChatViewMode] = React.useState(VIEW_MODES.CHAT);

  if (!claim || !claim.signing_channel) return null;

  const { name: channelName, claim_id: channelClaimId } = claim.signing_channel;

  return (
    <>
      <div className="section card-stack">
        <React.Suspense fallback={null}>
          {isMobile && isCurrentClaimLive ? (
            <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
              {/* Mobile needs to handle the livestream player like any video player */}
              <FileRenderInitiator uri={uri} />
            </div>
          ) : (
            <LivestreamIframeRender
              channelClaimId={channelClaimId}
              release={release}
              showLivestream={showLivestream}
              showScheduledInfo={showScheduledInfo}
            />
          )}
        </React.Suspense>

        {hideComments && !showScheduledInfo && (
          <div className="help--notice">
            {channelName
              ? __('%channel% has disabled chat for this stream. Enjoy the stream!', { channel: channelName })
              : __('This channel has disabled chat for this stream. Enjoy the stream!')}
          </div>
        )}

        {!activeStreamUri && !showScheduledInfo && !isCurrentClaimLive && (
          <div className="help--notice">
            {channelName
              ? __("%channelName% isn't live right now, but the chat is! Check back later to watch the stream.", {
                  channelName,
                })
              : __("This channel isn't live right now, but the chat is! Check back later to watch the stream.")}
          </div>
        )}

        {activeStreamUri && (
          <LivestreamLink
            title={__("Click here to access the stream that's currently active")}
            claimUri={activeStreamUri}
          />
        )}

        {isMobile && !hideComments && (
          <React.Suspense fallback={null}>
            <SwipeableDrawer
              open={Boolean(showChat)}
              toggleDrawer={() => setShowChat(!showChat)}
              title={
                <ChatModeSelector
                  superChats={superChats}
                  chatViewMode={chatViewMode}
                  setChatViewMode={(mode) => setChatViewMode(mode)}
                />
              }
              actions={
                <LivestreamMenu
                  noSuperchats={!superChats || superChats.length === 0}
                  superchatsHidden={superchatsHidden}
                  toggleSuperchats={() => setSuperchatsHidden(!superchatsHidden)}
                  isMobile
                />
              }
            >
              <LivestreamChatLayout
                uri={uri}
                hideHeader
                superchatsHidden={superchatsHidden}
                customViewMode={chatViewMode}
              />
            </SwipeableDrawer>

            <DrawerExpandButton label={__('Open Live Chat')} toggleDrawer={() => setShowChat(!showChat)} />
          </React.Suspense>
        )}

        <FileTitleSection uri={uri} livestream isLive={showLivestream} />
      </div>
    </>
  );
}

const ChatModeSelector = (chatSelectorProps: any) => {
  const { superChats, chatViewMode, setChatViewMode } = chatSelectorProps;
  const { superChatsFiatAmount, superChatsLBCAmount } = getTipValues(superChats);

  if (!superChats) {
    return __('Live Chat');
  }

  return (
    <Menu>
      <MenuButton>
        <span className="swipeable-drawer__title-menu">
          {chatViewMode === VIEW_MODES.CHAT ? __('Live Chat') : __('Super Chats')}
          <Icon icon={ICONS.DOWN} />
        </span>
      </MenuButton>

      <MenuList className="menu__list--header">
        <MenuItem className="menu__link" onSelect={() => setChatViewMode(VIEW_MODES.CHAT)}>
          {__('Live Chat')}
        </MenuItem>

        <MenuItem className="menu__link" onSelect={() => setChatViewMode(VIEW_MODES.SUPERCHAT)}>
          <div className="recommended-content__toggles">
            <CreditAmount amount={superChatsLBCAmount || 0} size={8} /> /
            <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {__('Tipped')}
          </div>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
