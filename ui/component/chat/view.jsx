// @flow
import 'scss/component/_livestream-chat.scss';

// $FlowFixMe

import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CreditAmount from 'component/common/credit-amount';
import ChatComment from 'component/chat/chatComment';
import ChatComments from 'component/chat/chatComments';
import LivestreamHyperchats from './livestream-hyperchats';
import LivestreamMenu from './livestream-menu';
import React from 'react';
import Yrbl from 'component/yrbl';
import { getTipValues } from 'util/livestream';
import Slide from '@mui/material/Slide';
import useGetUserMemberships from 'effects/use-get-user-memberships';

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
  hyperchatsHidden?: boolean,
  customViewMode?: string,
  setCustomViewMode?: (any) => void,
  // redux
  claimId?: string,
  comments: Array<Comment>,
  pinnedComments: Array<Comment>,
  superChats: Array<Comment>,
  doCommentList: (
    uri: string,
    parentId: ?string,
    page: number,
    pageSize: number,
    sortBy: ?number,
    isLivestream: boolean
  ) => void,
  doResolveUris: (uris: Array<string>, cache: boolean) => void,
  doHyperChatList: (uri: string) => void,
  claimsByUri: { [string]: any },
  doFetchUserMemberships: (claimIdCsv: string) => void,
  setLayountRendered: (boolean) => void,
};

export default function ChatLayout(props: Props) {
  const {
    claimId,
    comments: commentsByChronologicalOrder,
    embed,
    isPopoutWindow,
    pinnedComments,
    superChats: hyperChatsByAmount,
    uri,
    hideHeader,
    hyperchatsHidden,
    customViewMode,
    setCustomViewMode,
    doCommentList,
    doResolveUris,
    doHyperChatList,
    doFetchUserMemberships,
    claimsByUri,
    setLayountRendered,
  } = props;

  const isMobile = useIsMobile() && !isPopoutWindow;
  const isLimitedPopout = useIsMobile() && isPopoutWindow;

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
  const [textInjection, setTextInjection] = React.useState('');
  const [hideHyperchats, sethideHyperchats] = React.useState(hyperchatsHidden);
  // const [chatMode, setChatMode] = React.useState('slow');
  const chatMode = 'slow';

  let superChatsByChronologicalOrder = [];
  if (hyperChatsByAmount) hyperChatsByAmount.forEach((chat) => superChatsByChronologicalOrder.push(chat));
  if (superChatsByChronologicalOrder.length > 0) {
    superChatsByChronologicalOrder.sort((a, b) => b.timestamp - a.timestamp);
  }

  // get commenter claim ids for checking premium status
  const commenterClaimIds = commentsByChronologicalOrder.map((comment) => {
    return comment.channel_id;
  });

  // update premium status
  const shouldFetchUserMemberships = true;
  useGetUserMemberships(
    shouldFetchUserMemberships,
    commenterClaimIds,
    claimsByUri,
    doFetchUserMemberships,
    [commentsByChronologicalOrder],
    true
  );

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
      toggleHyperChat();
    } else {
      setViewMode(VIEW_MODES.CHAT);
    }

    if (discussionElement) {
      discussionElement.scrollTop = 0;
    }
  }

  function toggleHyperChat() {
    const hasNewSuperchats = !superchatsAmount || superChatsChannelUrls.length !== superchatsAmount;

    if (superChatsChannelUrls && hasNewSuperchats) {
      setSuperchatsAmount(superChatsChannelUrls.length);
      doResolveUris(superChatsChannelUrls, false);
    }

    setViewMode(VIEW_MODES.SUPERCHAT);
    if (setCustomViewMode) setCustomViewMode(VIEW_MODES.SUPERCHAT);
  }

  React.useEffect(() => {
    if (setLayountRendered) setLayountRendered(true);
  }, [setLayountRendered]);

  React.useEffect(() => {
    if (customViewMode && customViewMode !== viewMode) {
      setViewMode(customViewMode);
    }
  }, [customViewMode, viewMode]);

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri, undefined, 1, 75, undefined, true);
      doHyperChatList(uri);
    }
  }, [claimId, uri, doCommentList, doHyperChatList]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Just respond to 'commentsLength' and nothing else
  }, [commentsLength]);

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

  React.useEffect(() => {
    if (textInjection && textInjection.length) setTextInjection('');
  }, [textInjection]);

  if (!claimId) return null;

  if (openedPopoutWindow || chatHidden) {
    return (
      <div className="card livestream__chat">
        <div className="card__header--between livestreamDiscussion__header">
          <div className="card__title-section--small livestreamDiscussion__title">{__('Livestream Chat')}</div>
        </div>

        <div className="livestreamComments__wrapper">
          <div className="main--empty">
            <Yrbl
              title={__('Chat Hidden')}
              actions={
                <div className="section__actions">
                  {openedPopoutWindow && (
                    <Button
                      button="secondary"
                      label={__('Close Popout')}
                      onClick={() => {
                        openedPopoutWindow.close();
                        setPopoutWindow(undefined);
                      }}
                    />
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

  function handleCommentClick(authorTitle) {
    setTextInjection(authorTitle);
  }

  return (
    <div className={classnames('card livestream__chat', { 'livestream__chat--popout': isPopoutWindow })}>
      {!hideHeader && (
        <div className="card__header--between livestreamDiscussion__header">
          <div className="recommended-content__toggles">
            {/* the superchats in chronological order button */}
            <ChatContentToggle
              {...toggleProps}
              toggleMode={VIEW_MODES.CHAT}
              label={!isLimitedPopout ? __('Livestream Chat') : __('Chat')}
            />

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

          <LivestreamMenu
            isPopoutWindow={isPopoutWindow}
            hideChat={() => setChatHidden(true)}
            setPopoutWindow={(v) => setPopoutWindow(v)}
            isMobile={isMobile}
            toggleHyperchats={() => sethideHyperchats(!hideHyperchats)}
            // toggleFastMode={() => setChatMode(!fastModeEnabled)}
            hyperchatsHidden={hideHyperchats}
          />
        </div>
      )}

      <div className="livestreamComments__wrapper">
        <div
          className={classnames('livestream-comments__top-actions', {
            'livestream-comments__top-actions--mobile': isMobile,
          })}
        >
          {isMobile && ((pinnedComment && showPinned) || (hyperChatsByAmount && !hyperchatsHidden)) && (
            <div className="livestream__top-gradient" />
          )}

          {viewMode === VIEW_MODES.CHAT && hyperChatsByAmount && (
            <LivestreamHyperchats
              superChats={hyperChatsByAmount}
              toggleHyperChat={toggleHyperChat}
              hyperchatsHidden={hyperchatsHidden || hideHyperchats}
              isMobile={isMobile}
            />
          )}

          {false && viewMode === VIEW_MODES.SUPERCHAT && hyperChatsByAmount && (
            <div className="livestream-hyperchat-orderOptions">
              <b>Order by: </b>
              <label className="active">Date</label> | <label>amount</label>
            </div>
          )}

          {pinnedComment &&
            viewMode === VIEW_MODES.CHAT &&
            (isMobile ? (
              <Slide direction="left" in={showPinned} mountOnEnter unmountOnExit>
                <div className="livestream-pinned__wrapper--mobile">
                  <ChatComment
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
                  <ChatComment comment={pinnedComment} key={pinnedComment.comment_id} uri={uri} />

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

        <ChatComments
          uri={uri}
          viewMode={viewMode}
          comments={commentsToDisplay}
          isMobile={isMobile}
          restoreScrollPos={!scrolledPastRecent && isMobile && restoreScrollPos}
          handleCommentClick={handleCommentClick}
          chatMode={chatMode}
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
            textInjection={textInjection}
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
