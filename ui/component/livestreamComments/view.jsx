// @flow
import 'scss/component/_livestream-comments.scss';
import { parseSticker } from 'util/comments';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CreditAmount from 'component/common/credit-amount';
import LivestreamComment from 'component/livestreamComment';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';
import Spinner from 'component/spinner';
import Tooltip from 'component/common/tooltip';
import UriIndicator from 'component/uriIndicator';

type Props = {
  activeViewers: number,
  claim: ?StreamClaim,
  comments: Array<Comment>,
  embed?: boolean,
  fetchingComments: boolean,
  pinnedComments: Array<Comment>,
  superChats: Array<Comment>,
  uri: string,
  doCommentList: (string, string, number, number) => void,
  doCommentSocketConnect: (string, string) => void,
  doCommentSocketDisconnect: (string) => void,
  doSuperChatList: (string) => void,
};

const VIEW_MODE_CHAT = 'view_chat';
const VIEW_MODE_SUPER_CHAT = 'view_superchat';
const COMMENT_SCROLL_TIMEOUT = 25;

export default function LivestreamComments(props: Props) {
  const {
    claim,
    comments: commentsByChronologicalOrder,
    embed,
    fetchingComments,
    pinnedComments,
    superChats: superChatsByTipAmount,
    uri,
    doCommentList,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    doSuperChatList,
  } = props;

  let superChatsFiatAmount, superChatsLBCAmount, superChatsTotalAmount, hasSuperChats;

  const commentsRef = React.createRef();
  const [viewMode, setViewMode] = React.useState(VIEW_MODE_CHAT);
  const [scrollPos, setScrollPos] = React.useState(0);
  const [showPinned, setShowPinned] = React.useState(true);

  const claimId = claim && claim.claim_id;
  const commentsLength = commentsByChronologicalOrder && commentsByChronologicalOrder.length;
  // which kind of superchat to display, either
  const commentsToDisplay = viewMode === VIEW_MODE_CHAT ? commentsByChronologicalOrder : superChatsByTipAmount;
  const stickerSuperChats =
    superChatsByTipAmount && superChatsByTipAmount.filter(({ comment }) => Boolean(parseSticker(comment)));

  const discussionElement = document.querySelector('.livestream__comments');
  const pinnedComment = pinnedComments.length > 0 ? pinnedComments[0] : null;

  let superChatsReversed;
  // array of superchats organized by fiat or not first, then support amount
  if (superChatsByTipAmount) {
    const clonedSuperchats = JSON.parse(JSON.stringify(superChatsByTipAmount));

    // for top to bottom display, oldest superchat on top most recent on bottom
    superChatsReversed = clonedSuperchats.sort((a, b) => b.timestamp - a.timestamp);
  }

  const restoreScrollPos = React.useCallback(() => {
    if (discussionElement) discussionElement.scrollTop = 0;
  }, [discussionElement]);

  React.useEffect(() => {
    if (claimId) {
      doCommentList(uri, '', 1, 75);
      doSuperChatList(uri);
      doCommentSocketConnect(uri, claimId);
    }

    return () => {
      if (claimId) {
        doCommentSocketDisconnect(claimId);
      }
    };
  }, [claimId, uri, doCommentList, doSuperChatList, doCommentSocketConnect, doCommentSocketDisconnect]);

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
  }, [discussionElement, scrollPos]);

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

  // sum total amounts for fiat tips and lbc tips
  if (superChatsByTipAmount) {
    let fiatAmount = 0;
    let LBCAmount = 0;
    for (const superChat of superChatsByTipAmount) {
      if (superChat.is_fiat) {
        fiatAmount = fiatAmount + superChat.support_amount;
      } else {
        LBCAmount = LBCAmount + superChat.support_amount;
      }
    }

    superChatsFiatAmount = fiatAmount;
    superChatsLBCAmount = LBCAmount;
    superChatsTotalAmount = superChatsFiatAmount + superChatsLBCAmount;
    hasSuperChats = (superChatsTotalAmount || 0) > 0;
  }

  function getStickerUrl(comment: string) {
    const stickerFromComment = parseSticker(comment);
    return stickerFromComment && stickerFromComment.url;
  }

  const getChatContentToggle = (toggleMode: string, label: any) => (
    <Button
      className={classnames('button-toggle', { 'button-toggle--active': viewMode === toggleMode })}
      label={label}
      onClick={() => {
        setViewMode(toggleMode);
        const livestreamCommentsDiv = document.getElementsByClassName('livestream__comments')[0];
        const divHeight = livestreamCommentsDiv.scrollHeight;
        livestreamCommentsDiv.scrollTop = toggleMode === VIEW_MODE_CHAT ? divHeight : divHeight * -1;
      }}
    />
  );

  return !claim ? null : (
    <div className="card livestream__discussion">
      <div className="card__header--between livestreamDiscussion__header">
        <div className="card__title-section--small livestreamDiscussion__title">{__('Live discussion')}</div>
        {hasSuperChats && (
          <div className="recommended-content__toggles">
            {/* the superchats in chronological order button */}
            {getChatContentToggle(VIEW_MODE_CHAT, __('Chat'))}

            {/* the button to show superchats listed by most to least support amount */}
            {getChatContentToggle(
              VIEW_MODE_SUPER_CHAT,
              <>
                <CreditAmount amount={superChatsTotalAmount || 0} size={8} /> /
                <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {__('Tipped')}
              </>
            )}
          </div>
        )}
      </div>
      <>
        {fetchingComments && !commentsByChronologicalOrder && (
          <div className="main--empty">
            <Spinner />
          </div>
        )}
        <div ref={commentsRef} className="livestreamComments__wrapper">
          {viewMode === VIEW_MODE_CHAT && superChatsByTipAmount && hasSuperChats && (
            <div className="livestreamSuperchats__wrapper">
              <div className="livestreamSuperchats__inner">
                {superChatsByTipAmount.map((superChat: Comment) => {
                  const isSticker = stickerSuperChats && stickerSuperChats.includes(superChat);

                  const SuperChatWrapper = !isSticker
                    ? ({ children }) => <Tooltip label={superChat.comment}>{children}</Tooltip>
                    : ({ children }) => <>{children}</>;

                  return (
                    <SuperChatWrapper key={superChat.comment_id}>
                      <div className="livestreamSuperchat">
                        <div className="livestreamSuperchat__thumbnail">
                          <ChannelThumbnail uri={superChat.channel_url} xsmall />
                        </div>

                        <div
                          className={classnames('livestreamSuperchat__info', {
                            'livestreamSuperchat__info--sticker': isSticker,
                            'livestreamSuperchat__info--notSticker': stickerSuperChats && !isSticker,
                          })}
                        >
                          <div className="livestreamSuperchat__info--user">
                            <UriIndicator uri={superChat.channel_url} link />
                            <CreditAmount
                              size={10}
                              className="livestreamSuperchat__amount-large"
                              amount={superChat.support_amount}
                              isFiat={superChat.is_fiat}
                            />
                          </div>
                          {stickerSuperChats.includes(superChat) && getStickerUrl(superChat.comment) && (
                            <div className="livestreamSuperchat__info--image">
                              <OptimizedImage src={getStickerUrl(superChat.comment)} waitLoad />
                            </div>
                          )}
                        </div>
                      </div>
                    </SuperChatWrapper>
                  );
                })}
              </div>
            </div>
          )}

          {pinnedComment && showPinned && viewMode === VIEW_MODE_CHAT && (
            <div className="livestreamPinned__wrapper">
              <LivestreamComment key={pinnedComment.comment_id} uri={uri} comment={pinnedComment} />
              <Button
                title={__('Dismiss pinned comment')}
                button="inverse"
                className="close-button"
                onClick={() => setShowPinned(false)}
                icon={ICONS.REMOVE}
              />
            </div>
          )}

          {/* top to bottom comment display */}
          {!fetchingComments && commentsByChronologicalOrder.length > 0 ? (
            <div className="livestream__comments">
              {viewMode === VIEW_MODE_CHAT &&
                commentsToDisplay.map((comment) => (
                  <LivestreamComment key={comment.comment_id} uri={uri} comment={comment} />
                ))}

              {/* listing comments on top of eachother */}
              {viewMode === VIEW_MODE_SUPER_CHAT &&
                superChatsReversed &&
                superChatsReversed.map((comment) => (
                  <LivestreamComment key={comment.comment_id} uri={uri} comment={comment} />
                ))}
            </div>
          ) : (
            <div className="main--empty" style={{ flex: 1 }} />
          )}

          {scrollPos < 0 && viewMode === VIEW_MODE_CHAT && (
            <Button
              button="secondary"
              className="livestreamComments__scrollToRecent"
              label={__('Recent Comments')}
              onClick={restoreScrollPos}
              iconRight={ICONS.DOWN}
            />
          )}

          <div className="livestream__commentCreate">
            <CommentCreate livestream bottom embed={embed} uri={uri} onDoneReplying={restoreScrollPos} />
          </div>
        </div>
      </>
    </div>
  );
}
