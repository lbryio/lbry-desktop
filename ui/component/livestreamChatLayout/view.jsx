// @flow
import 'scss/component/_livestream-chat.scss';

// $FlowFixMe
import { grey } from '@mui/material/colors';

import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CreditAmount from 'component/common/credit-amount';
import LivestreamComment from 'component/livestreamComment';
import LivestreamComments from 'component/livestreamComments';
import LivestreamSuperchats from './livestream-superchats';
import LivestreamMenu from './livestream-menu';
import React from 'react';
import Yrbl from 'component/yrbl';
import { getTipValues } from 'util/livestream';
import Slide from '@mui/material/Slide';

export const VIEW_MODES = {
  CHAT: 'chat',
  SUPERCHAT: 'sc',
};
const COMMENT_SCROLL_TIMEOUT = 25;

type Props = {
  embed?: boolean,
  isPopoutWindow?: boolean,
  uri: string,
  hideHeader?: boolean,
  superchatsHidden?: boolean,
  customViewMode?: string,
  setCustomViewMode?: (any) => void,
  // redux
  claimId?: string,
  comments: Array<Comment>,
  pinnedComments: Array<Comment>,
  superChats: Array<Comment>,
  theme: string,
  doCommentList: (uri: string, parentId: string, page: number, pageSize: number) => void,
  doResolveUris: (uris: Array<string>, cache: boolean) => void,
  doSuperChatList: (uri: string) => void,
};

export default function LivestreamChatLayout(props: Props) {
  const {
    claimId,
    comments: commentsByChronologicalOrder,
    embed,
    isPopoutWindow,
    pinnedComments,
    superChats: superChatsByAmount,
    uri,
    hideHeader,
    superchatsHidden,
    customViewMode,
    theme,
    setCustomViewMode,
    doCommentList,
    doResolveUris,
    doSuperChatList,
  } = props;

  const isMobile = useIsMobile() && !isPopoutWindow;

  const webElement = document.querySelector('.livestream__comments');
  const mobileElement = document.querySelector('.livestream__comments--mobile');
  const discussionElement = isMobile ? mobileElement : webElement;
  const allCommentsElem = document.querySelectorAll('.livestream__comment');
  const lastCommentElem = allCommentsElem && allCommentsElem[allCommentsElem.length - 1];

  const [viewMode, setViewMode] = React.useState(VIEW_MODES.CHAT);
  const [scrollPos, setScrollPos] = React.useState(0);
  const [showPinned, setShowPinned] = React.useState(true);
  const [resolvingSuperChats, setResolvingSuperChats] = React.useState(false);
  const [openedPopoutWindow, setPopoutWindow] = React.useState(undefined);
  const [chatHidden, setChatHidden] = React.useState(false);
  const [didInitialScroll, setDidInitialScroll] = React.useState(false);
  const [minScrollHeight, setMinScrollHeight] = React.useState(0);
  const [keyboardOpened, setKeyboardOpened] = React.useState(false);
  const [superchatsAmount, setSuperchatsAmount] = React.useState(false);
  const [chatElement, setChatElement] = React.useState();

  let superChatsByChronologicalOrder = [];
  if (superChatsByAmount) superChatsByAmount.forEach((chat) => superChatsByChronologicalOrder.push(chat));
  if (superChatsByChronologicalOrder.length > 0) {
    superChatsByChronologicalOrder.sort((a, b) => b.timestamp - a.timestamp);
  }

  const commentsToDisplay =
    viewMode === VIEW_MODES.CHAT ? commentsByChronologicalOrder : superChatsByChronologicalOrder;
  const commentsLength = commentsToDisplay && commentsToDisplay.length;
  const pinnedComment = pinnedComments.length > 0 ? pinnedComments[0] : null;
  const { superChatsChannelUrls, superChatsFiatAmount, superChatsLBCAmount } = getTipValues(
    superChatsByChronologicalOrder
  );
  const scrolledPastRecent = Boolean(
    (viewMode !== VIEW_MODES.SUPERCHAT || !resolvingSuperChats) &&
      (!isMobile ? scrollPos < 0 : scrollPos < minScrollHeight)
  );

  const restoreScrollPos = React.useCallback(() => {
    if (discussionElement) {
      discussionElement.scrollTop = !isMobile ? 0 : discussionElement.scrollHeight;

      if (isMobile) {
        const pos = lastCommentElem && discussionElement.scrollTop - lastCommentElem.getBoundingClientRect().height;

        if (!minScrollHeight || minScrollHeight !== pos) {
          setMinScrollHeight(pos);
        }
      }
    }
  }, [discussionElement, isMobile, lastCommentElem, minScrollHeight]);

  function toggleClick(toggleMode: string) {
    if (toggleMode === VIEW_MODES.SUPERCHAT) {
      toggleSuperChat();
    } else {
      setViewMode(VIEW_MODES.CHAT);
    }

    if (discussionElement) {
      discussionElement.scrollTop = 0;
    }
  }

  function toggleSuperChat() {
    const hasNewSuperchats = !superchatsAmount || superChatsChannelUrls.length !== superchatsAmount;

    if (superChatsChannelUrls && hasNewSuperchats) {
      setSuperchatsAmount(superChatsChannelUrls.length);
      doResolveUris(superChatsChannelUrls, false);
    }

    setViewMode(VIEW_MODES.SUPERCHAT);
    if (setCustomViewMode) setCustomViewMode(VIEW_MODES.SUPERCHAT);
  }

  React.useEffect(() => {
    if (customViewMode && customViewMode !== viewMode) {
      setViewMode(customViewMode);
    }
  }, [customViewMode, viewMode]);

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri, '', 1, 75);
      doSuperChatList(uri);
    }
  }, [claimId, uri, doCommentList, doSuperChatList]);

  React.useEffect(() => {
    if (isMobile && !didInitialScroll) {
      restoreScrollPos();
      setDidInitialScroll(true);
    }
  }, [didInitialScroll, isMobile, restoreScrollPos, viewMode]);

  React.useEffect(() => {
    if (discussionElement && !openedPopoutWindow) setChatElement(discussionElement);
  }, [discussionElement, openedPopoutWindow]);

  // Register scroll handler (TODO: Should throttle/debounce)
  React.useEffect(() => {
    function handleScroll() {
      if (chatElement) {
        const scrollTop = chatElement.scrollTop;

        if (scrollTop !== scrollPos) {
          setScrollPos(scrollTop);
        }
      }
    }

    if (chatElement) {
      chatElement.addEventListener('scroll', handleScroll);

      return () => chatElement.removeEventListener('scroll', handleScroll);
    }
  }, [chatElement, scrollPos]);

  // Retain scrollPos=0 when receiving new messages.
  React.useEffect(() => {
    if (discussionElement && commentsLength > 0) {
      // Only update comment scroll if the user hasn't scrolled up to view old comments
      // $FlowFixMe
      if (scrollPos && (!isMobile || minScrollHeight) && scrollPos >= minScrollHeight) {
        // +ve scrollPos: not scrolled (Usually, there'll be a few pixels beyond 0).
        // -ve scrollPos: user scrolled.
        const timer = setTimeout(() => {
          // Use a timer here to ensure we reset after the new comment has been rendered.
          if (!isMobile) {
            discussionElement.scrollTop = 0;
          } else {
            restoreScrollPos();
          }
        }, COMMENT_SCROLL_TIMEOUT);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsLength]); // (Just respond to 'commentsLength' updates and nothing else)

  // Restore Scroll Pos after mobile input opens keyboard and avoid scroll height conflicts
  React.useEffect(() => {
    if (keyboardOpened) {
      const timer = setTimeout(() => {
        restoreScrollPos();
        setKeyboardOpened(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [keyboardOpened, restoreScrollPos]);

  if (!claimId) return null;

  if (openedPopoutWindow || chatHidden) {
    return (
      <div className="card livestream__chat">
        <div className="card__header--between livestreamDiscussion__header">
          <div className="card__title-section--small livestreamDiscussion__title">{__('Live Chat')}</div>
        </div>

        <div className="livestreamComments__wrapper">
          <div className="main--empty">
            <Yrbl
              title={__('Chat Hidden')}
              actions={
                <div className="section__actions">
                  {openedPopoutWindow && (
                    <Button button="secondary" label={__('Close Popout')} onClick={() => openedPopoutWindow.close()} />
                  )}

                  {chatHidden && (
                    <Button button="secondary" label={__('Show Chat')} onClick={() => setChatHidden(false)} />
                  )}
                </div>
              }
            />
          </div>

          <div className="livestream__comment-create">
            <CommentCreate isLivestream bottom uri={uri} disableInput />
          </div>
        </div>
      </div>
    );
  }

  const toggleProps = { viewMode, onClick: (toggleMode) => toggleClick(toggleMode) };

  return (
    <div className={classnames('card livestream__chat', { 'livestream__chat--popout': isPopoutWindow })}>
      {!hideHeader && (
        <div className="card__header--between livestreamDiscussion__header">
          <div className="card__title-section--small livestreamDiscussion__title">
            {__('Live Chat')}

            <LivestreamMenu
              isPopoutWindow={isPopoutWindow}
              hideChat={() => setChatHidden(true)}
              setPopoutWindow={(v) => setPopoutWindow(v)}
              isMobile={isMobile}
            />
          </div>

          {superChatsByChronologicalOrder && (
            <div className="recommended-content__toggles">
              {/* the superchats in chronological order button */}
              <ChatContentToggle {...toggleProps} toggleMode={VIEW_MODES.CHAT} label={__('Chat')} />

              {/* the button to show superchats listed by most to least support amount */}
              <ChatContentToggle
                {...toggleProps}
                toggleMode={VIEW_MODES.SUPERCHAT}
                label={
                  <>
                    <CreditAmount amount={superChatsLBCAmount || 0} size={8} /> /&nbsp;
                    <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {__('Tipped')}
                  </>
                }
              />
            </div>
          )}
        </div>
      )}

      <div className="livestreamComments__wrapper">
        <div
          className={classnames('livestream-comments__top-actions', {
            'livestream-comments__top-actions--mobile': isMobile,
          })}
        >
          {isMobile && ((pinnedComment && showPinned) || (superChatsByAmount && !superchatsHidden)) && (
            <MobileDrawerTopGradient theme={theme} />
          )}

          {viewMode === VIEW_MODES.CHAT && superChatsByAmount && (
            <LivestreamSuperchats
              superChats={superChatsByAmount}
              toggleSuperChat={toggleSuperChat}
              superchatsHidden={superchatsHidden}
              isMobile={isMobile}
            />
          )}

          {pinnedComment &&
            viewMode === VIEW_MODES.CHAT &&
            (isMobile ? (
              <Slide direction="left" in={showPinned} mountOnEnter unmountOnExit>
                <div className="livestream-pinned__wrapper--mobile">
                  <LivestreamComment
                    comment={pinnedComment}
                    key={pinnedComment.comment_id}
                    uri={uri}
                    handleDismissPin={() => setShowPinned(false)}
                    isMobile
                    setResolvingSuperChats={setResolvingSuperChats}
                  />
                </div>
              </Slide>
            ) : (
              showPinned && (
                <div className="livestream-pinned__wrapper">
                  <LivestreamComment comment={pinnedComment} key={pinnedComment.comment_id} uri={uri} />

                  <Button
                    title={__('Dismiss pinned comment')}
                    button="inverse"
                    className="close-button"
                    onClick={() => setShowPinned(false)}
                    icon={ICONS.REMOVE}
                  />
                </div>
              )
            ))}
        </div>

        <LivestreamComments
          uri={uri}
          viewMode={viewMode}
          comments={commentsToDisplay}
          isMobile={isMobile}
          restoreScrollPos={!scrolledPastRecent && isMobile && restoreScrollPos}
        />

        {scrolledPastRecent && (
          <Button
            button="secondary"
            className="livestream-comments__scroll-to-recent"
            label={viewMode === VIEW_MODES.CHAT ? __('Recent Comments') : __('Recent Tips')}
            onClick={restoreScrollPos}
            iconRight={ICONS.DOWN}
          />
        )}

        <div className="livestream__comment-create">
          <CommentCreate
            isLivestream
            bottom
            embed={embed}
            uri={uri}
            onDoneReplying={restoreScrollPos}
            onSlimInputClose={!scrolledPastRecent && isMobile ? () => setKeyboardOpened(true) : undefined}
          />
        </div>
      </div>
    </div>
  );
}

type ToggleProps = {
  viewMode: string,
  toggleMode: string,
  label: string | any,
  onClick: (string) => void,
};

const ChatContentToggle = (props: ToggleProps) => {
  const { viewMode, toggleMode, label, onClick } = props;

  return (
    <Button
      className={classnames('button-toggle', { 'button-toggle--active': viewMode === toggleMode })}
      label={label}
      onClick={() => onClick(toggleMode)}
    />
  );
};

type GradientProps = {
  theme: string,
};

const MobileDrawerTopGradient = (gradientProps: GradientProps) => {
  const { theme } = gradientProps;

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${theme === 'light' ? grey[300] : grey[900]} 0, transparent 65%)`,
      }}
      className="livestream__top-gradient"
    />
  );
};
