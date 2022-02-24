// @flow
import 'scss/component/_swipeable-drawer.scss';

// $FlowFixMe
import { Global } from '@emotion/react';

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
  activeViewers?: number,
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
    activeViewers,
  } = props;

  const isMobile = useIsMobile();

  const [showChat, setShowChat] = React.useState(undefined);
  const [superchatsHidden, setSuperchatsHidden] = React.useState(false);
  const [chatViewMode, setChatViewMode] = React.useState(VIEW_MODES.CHAT);

  if (!claim || !claim.signing_channel) return null;

  const { name: channelName, claim_id: channelClaimId } = claim.signing_channel;

  return (
    <>
      {!isMobile && <GlobalStyles />}

      <div className="section card-stack">
        <React.Suspense fallback={null}>
          {isMobile && isCurrentClaimLive ? (
            <div className={PRIMARY_PLAYER_WRAPPER_CLASS}>
              {/* Mobile needs to handle the livestream player like any video player */}
              <FileRenderInitiator uri={claim.canonical_url} />
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
                  activeViewers={activeViewers}
                />
              }
              hasSubtitle={activeViewers}
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
                setCustomViewMode={(mode) => setChatViewMode(mode)}
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
  const { superChats, chatViewMode, setChatViewMode, activeViewers } = chatSelectorProps;
  const { superChatsFiatAmount, superChatsLBCAmount } = getTipValues(superChats);

  const titleProps = { chatViewMode, activeViewers };

  if (!superChats) {
    return <ChatDrawerTitle {...titleProps} />;
  }

  return (
    <Menu>
      <MenuButton>
        <div className="swipeable-drawer__menu">
          <ChatDrawerTitle {...titleProps} />

          <Icon icon={ICONS.DOWN} />
        </div>
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

const ChatDrawerTitle = (titleProps: any) => {
  const { chatViewMode, activeViewers } = titleProps;

  return (
    <div className="swipeable-drawer__title-menu">
      <span className="swipeable-drawer__title">
        {chatViewMode === VIEW_MODES.CHAT ? __('Live Chat') : __('HyperChats')}
      </span>

      {activeViewers && (
        <span className="swipeable-drawer__subtitle">{__('%view_count% viewers', { view_count: activeViewers })}</span>
      )}
    </div>
  );
};

const GlobalStyles = () => (
  <Global
    styles={{
      body: {
        'scrollbar-width': '0px',

        '&::-webkit-scrollbar': {
          width: '0px',
          height: '0px',
        },
      },
    }}
  />
);
