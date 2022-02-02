// @flow
import 'scss/component/_livestream-chat.scss';

import { formatLbryUrlForWeb } from 'util/url';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import { useHistory } from 'react-router-dom';
import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';
import LivestreamComment from 'component/livestreamComment';
import LivestreamComments from 'component/livestreamComments';
import LivestreamSuperchats from './livestream-superchats';
import React from 'react';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';

const IS_TIMESTAMP_VISIBLE = () =>
  // $FlowFixMe
  document.documentElement.style.getPropertyValue('--live-timestamp-opacity') === '0.5';

const TOGGLE_TIMESTAMP_OPACITY = () =>
  // $FlowFixMe
  document.documentElement.style.setProperty('--live-timestamp-opacity', IS_TIMESTAMP_VISIBLE() ? '0' : '0.5');

const VIEW_MODES = {
  CHAT: 'chat',
  SUPERCHAT: 'sc',
};
const COMMENT_SCROLL_TIMEOUT = 25;
const LARGE_SUPER_CHAT_LIST_THRESHOLD = 20;

type Props = {
  claim: ?StreamClaim,
  comments: Array<Comment>,
  embed?: boolean,
  isPopoutWindow?: boolean,
  pinnedComments: Array<Comment>,
  superChats: Array<Comment>,
  uri: string,
  hideHeader?: boolean,
  doCommentList: (string, string, number, number) => void,
  doResolveUris: (Array<string>, boolean) => void,
  doSuperChatList: (string) => void,
};

export default function LivestreamChatLayout(props: Props) {
  const {
    claim,
    comments: commentsByChronologicalOrder,
    embed,
    isPopoutWindow,
    pinnedComments,
    superChats: superChatsByAmount,
    uri,
    hideHeader,
    doCommentList,
    doResolveUris,
    doSuperChatList,
  } = props;

  const {
    location: { pathname },
  } = useHistory();

  const isMobile = useIsMobile();

  const discussionElement = document.querySelector('.livestream__comments');

  const restoreScrollPos = React.useCallback(() => {
    if (discussionElement) discussionElement.scrollTop = 0;
  }, [discussionElement]);

  const commentsRef = React.createRef();

  const [viewMode, setViewMode] = React.useState(VIEW_MODES.CHAT);
  const [scrollPos, setScrollPos] = React.useState(0);
  const [showPinned, setShowPinned] = React.useState(true);
  const [resolvingSuperChats, setResolvingSuperChats] = React.useState(false);
  const [mention, setMention] = React.useState();
  const [openedPopoutWindow, setPopoutWindow] = React.useState(undefined);
  const [chatHidden, setChatHidden] = React.useState(false);

  const quickMention =
    mention && formatLbryUrlForWeb(mention).substring(1, formatLbryUrlForWeb(mention).indexOf(':') + 3);
  const claimId = claim && claim.claim_id;
  const commentsToDisplay = viewMode === VIEW_MODES.CHAT ? commentsByChronologicalOrder : superChatsByAmount;
  const commentsLength = commentsToDisplay && commentsToDisplay.length;
  const pinnedComment = pinnedComments.length > 0 ? pinnedComments[0] : null;

  let superChatsChannelUrls = [];
  let superChatsFiatAmount = 0;
  let superChatsLBCAmount = 0;
  if (superChatsByAmount) {
    superChatsByAmount.forEach((superChat) => {
      const { is_fiat: isFiat, support_amount: tipAmount, channel_url: uri } = superChat;

      if (isFiat) {
        superChatsFiatAmount = superChatsFiatAmount + tipAmount;
      } else {
        superChatsLBCAmount = superChatsLBCAmount + tipAmount;
      }
      superChatsChannelUrls.push(uri || '0');
    });
  }

  function toggleSuperChat() {
    if (superChatsChannelUrls && superChatsChannelUrls.length > 0) {
      doResolveUris(superChatsChannelUrls, true);

      if (superChatsByAmount.length > LARGE_SUPER_CHAT_LIST_THRESHOLD) {
        setResolvingSuperChats(true);
      }
    }
    setViewMode(VIEW_MODES.SUPERCHAT);
  }

  function handlePopout() {
    const newWindow = window.open('/$/popout' + pathname, 'Popout Chat', 'height=700,width=400');

    // Add function to newWindow when closed (either manually or from button component)
    newWindow.onbeforeunload = () => setPopoutWindow(undefined);

    if (window.focus) newWindow.focus();
    setPopoutWindow(newWindow);
  }

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri, '', 1, 75);
      doSuperChatList(uri);
    }
  }, [claimId, uri, doCommentList, doSuperChatList]);

  // Register scroll handler (TODO: Should throttle/debounce)
  React.useEffect(() => {
    function handleScroll() {
      if (discussionElement) {
        const scrollTop = discussionElement.scrollTop;
        if (scrollTop !== scrollPos) {
          setScrollPos(scrollTop);
        }
      }
    }

    if (discussionElement) {
      discussionElement.addEventListener('scroll', handleScroll);
      return () => discussionElement.removeEventListener('scroll', handleScroll);
    }
  }, [discussionElement, scrollPos, viewMode]);

  // Retain scrollPos=0 when receiving new messages.
  React.useEffect(() => {
    if (discussionElement && commentsLength > 0) {
      // Only update comment scroll if the user hasn't scrolled up to view old comments
      if (scrollPos >= 0) {
        // +ve scrollPos: not scrolled (Usually, there'll be a few pixels beyond 0).
        // -ve scrollPos: user scrolled.
        const timer = setTimeout(() => {
          // Use a timer here to ensure we reset after the new comment has been rendered.
          discussionElement.scrollTop = 0;
        }, COMMENT_SCROLL_TIMEOUT);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentsLength]); // (Just respond to 'commentsLength' updates and nothing else)

  // Stop spinner for resolving superchats
  React.useEffect(() => {
    if (resolvingSuperChats) {
      // The real solution to the sluggishness is to fix the claim store/selectors
      // and to paginate the long superchat list. This serves as a band-aid,
      // showing a spinner while we batch-resolve. The duration is just a rough
      // estimate -- the lag will handle the remaining time.
      const timer = setTimeout(() => {
        setResolvingSuperChats(false);
        // Scroll to the top:
        if (discussionElement) {
          const divHeight = discussionElement.scrollHeight;
          discussionElement.scrollTop = divHeight * -1;
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [discussionElement, resolvingSuperChats]);

  if (!claim) return null;

  const chatContentToggle = (toggleMode: string, label: any) => (
    <Button
      className={classnames('button-toggle', { 'button-toggle--active': viewMode === toggleMode })}
      label={label}
      onClick={() => {
        if (toggleMode === VIEW_MODES.SUPERCHAT) {
          toggleSuperChat();
        } else {
          setViewMode(VIEW_MODES.CHAT);
        }

        if (discussionElement) {
          const divHeight = discussionElement.scrollHeight;
          discussionElement.scrollTop = toggleMode === VIEW_MODES.CHAT ? divHeight : divHeight * -1;
        }
      }}
    />
  );

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

          <div className="livestream__commentCreate">
            <CommentCreate isLivestream bottom uri={uri} disableInput />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classnames('card livestream__chat', { 'livestream__chat--popout': isPopoutWindow })}>
      {!hideHeader && (
        <div className="card__header--between livestreamDiscussion__header">
          <div className="card__title-section--small livestreamDiscussion__title">
            {__('Live Chat')}

            <Menu>
              <MenuButton className="menu__button">
                <Icon size={18} icon={ICONS.SETTINGS} />
              </MenuButton>

              <MenuList className="menu__list">
                <MenuItem className="comment__menu-option" onSelect={TOGGLE_TIMESTAMP_OPACITY}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={ICONS.TIME} />
                    {__('Toggle Timestamps')}
                  </span>
                </MenuItem>

                <MenuItem className="comment__menu-option" onSelect={() => setChatHidden(true)}>
                  <span className="menu__link">
                    <Icon aria-hidden icon={ICONS.EYE} />
                    {__('Hide Chat')}
                  </span>
                </MenuItem>

                {!isPopoutWindow && !isMobile && (
                  <>
                    <MenuItem className="comment__menu-option" onSelect={handlePopout}>
                      <span className="menu__link">
                        <Icon aria-hidden icon={ICONS.EXTERNAL} />
                        {__('Popout Chat')}
                      </span>
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </div>

          {superChatsByAmount && (
            <div className="recommended-content__toggles">
              {/* the superchats in chronological order button */}
              {chatContentToggle(VIEW_MODES.CHAT, __('Chat'))}

              {/* the button to show superchats listed by most to least support amount */}
              {chatContentToggle(
                VIEW_MODES.SUPERCHAT,
                <>
                  <CreditAmount amount={superChatsLBCAmount || 0} size={8} /> /
                  <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {__('Tipped')}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div ref={commentsRef} className="livestreamComments__wrapper">
        {viewMode === VIEW_MODES.CHAT && superChatsByAmount && (
          <LivestreamSuperchats superChats={superChatsByAmount} toggleSuperChat={toggleSuperChat} />
        )}

        {pinnedComment && showPinned && viewMode === VIEW_MODES.CHAT && (
          <div className="livestreamPinned__wrapper">
            <LivestreamComment
              comment={pinnedComment}
              key={pinnedComment.comment_id}
              uri={uri}
              pushMention={setMention}
            />

            <Button
              title={__('Dismiss pinned comment')}
              button="inverse"
              className="close-button"
              onClick={() => setShowPinned(false)}
              icon={ICONS.REMOVE}
            />
          </div>
        )}

        {viewMode === VIEW_MODES.SUPERCHAT && resolvingSuperChats ? (
          <div className="main--empty">
            <Spinner />
          </div>
        ) : (
          <LivestreamComments uri={uri} commentsToDisplay={commentsToDisplay} pushMention={setMention} />
        )}

        {scrollPos < 0 && (
          <Button
            button="secondary"
            className="livestreamComments__scrollToRecent"
            label={viewMode === VIEW_MODES.CHAT ? __('Recent Comments') : __('Recent Tips')}
            onClick={restoreScrollPos}
            iconRight={ICONS.DOWN}
          />
        )}

        <div className="livestream__commentCreate">
          <CommentCreate
            isLivestream
            bottom
            embed={embed}
            uri={uri}
            onDoneReplying={restoreScrollPos}
            pushedMention={quickMention}
            setPushedMention={setMention}
          />
        </div>
      </div>
    </div>
  );
}
