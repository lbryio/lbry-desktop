// @flow
import React from 'react';
import classnames from 'classnames';
import Spinner from 'component/spinner';
import CommentCreate from 'component/commentCreate';
import LivestreamComment from 'component/livestreamComment';
import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';
import CreditAmount from 'component/common/credit-amount';
import ChannelThumbnail from 'component/channelThumbnail';
import Tooltip from 'component/common/tooltip';
import * as ICONS from 'constants/icons';
import OptimizedImage from 'component/optimizedImage';
import { parseSticker } from 'util/comments';

type Props = {
  uri: string,
  claim: ?StreamClaim,
  activeViewers: number,
  embed?: boolean,
  doCommentSocketConnect: (string, string) => void,
  doCommentSocketDisconnect: (string) => void,
  doCommentList: (string, string, number, number) => void,
  comments: Array<Comment>,
  pinnedComments: Array<Comment>,
  fetchingComments: boolean,
  doSuperChatList: (string) => void,
  superChats: Array<Comment>,
  myChannelIds: ?Array<string>,
  doResolveUris: (Array<string>, boolean) => void,
};

const VIEW_MODE_CHAT = 'view_chat';
const VIEW_MODE_SUPER_CHAT = 'view_superchat';
const COMMENT_SCROLL_TIMEOUT = 25;
const LARGE_SUPER_CHAT_LIST_THRESHOLD = 20;

export default function LivestreamComments(props: Props) {
  const {
    claim,
    uri,
    embed,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    comments: commentsByChronologicalOrder,
    pinnedComments,
    doCommentList,
    fetchingComments,
    doSuperChatList,
    myChannelIds,
    superChats: superChatsByTipAmount,
    doResolveUris,
  } = props;

  let superChatsFiatAmount, superChatsLBCAmount, superChatsTotalAmount, hasSuperChats;

  const commentsRef = React.createRef();
  const [viewMode, setViewMode] = React.useState(VIEW_MODE_CHAT);
  const [scrollPos, setScrollPos] = React.useState(0);
  const [showPinned, setShowPinned] = React.useState(true);
  const [resolvingSuperChat, setResolvingSuperChat] = React.useState(false);
  const claimId = claim && claim.claim_id;
  const commentsLength = commentsByChronologicalOrder && commentsByChronologicalOrder.length;

  const commentsToDisplay = viewMode === VIEW_MODE_CHAT ? commentsByChronologicalOrder : superChatsByTipAmount;
  const stickerSuperChats =
    superChatsByTipAmount && superChatsByTipAmount.filter(({ comment }) => Boolean(parseSticker(comment)));

  const discussionElement = document.querySelector('.livestream__comments');

  const pinnedComment = pinnedComments.length > 0 ? pinnedComments[0] : null;

  const restoreScrollPos = React.useCallback(() => {
    if (discussionElement) {
      discussionElement.scrollTop = 0;
    }
  }, [discussionElement]);

  const superChatTopTen = React.useMemo(() => {
    return superChatsByTipAmount ? superChatsByTipAmount.slice(0, 10) : superChatsByTipAmount;
  }, [superChatsByTipAmount]);

  const showMoreSuperChatsButton =
    superChatTopTen && superChatsByTipAmount && superChatTopTen.length < superChatsByTipAmount.length;

  function resolveSuperChat() {
    if (superChatsByTipAmount && superChatsByTipAmount.length > 0) {
      doResolveUris(
        superChatsByTipAmount.map((comment) => comment.channel_url || '0'),
        true
      );

      if (superChatsByTipAmount.length > LARGE_SUPER_CHAT_LIST_THRESHOLD) {
        setResolvingSuperChat(true);
      }
    }
  }

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

  // Stop spinner for resolving superchats
  React.useEffect(() => {
    if (resolvingSuperChat) {
      // The real solution to the sluggishness is to fix the claim store/selectors
      // and to paginate the long superchat list. This serves as a band-aid,
      // showing a spinner while we batch-resolve. The duration is just a rough
      // estimate -- the lag will handle the remaining time.
      const timer = setTimeout(() => {
        setResolvingSuperChat(false);
        // Scroll to the top:
        const livestreamCommentsDiv = document.getElementsByClassName('livestream__comments')[0];
        const divHeight = livestreamCommentsDiv.scrollHeight;
        livestreamCommentsDiv.scrollTop = divHeight * -1;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resolvingSuperChat]);

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

  let superChatsReversed;
  // array of superchats organized by fiat or not first, then support amount
  if (superChatsByTipAmount) {
    const clonedSuperchats = JSON.parse(JSON.stringify(superChatsByTipAmount));

    // for top to bottom display, oldest superchat on top most recent on bottom
    superChatsReversed = clonedSuperchats.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });
  }

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    return myChannelIds ? myChannelIds.includes(channelId) : false;
  }

  if (!claim) {
    return null;
  }

  function getStickerUrl(comment: string) {
    const stickerFromComment = parseSticker(comment);
    return stickerFromComment && stickerFromComment.url;
  }

  return (
    <div className="card livestream__discussion">
      <div className="card__header--between livestream-discussion__header">
        <div className="livestream-discussion__title">{__('Live discussion')}</div>
        {hasSuperChats && (
          <div className="recommended-content__toggles">
            {/* the superchats in chronological order button */}
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_CHAT,
              })}
              label={__('Chat')}
              onClick={() => {
                setViewMode(VIEW_MODE_CHAT);
                const livestreamCommentsDiv = document.getElementsByClassName('livestream__comments')[0];
                livestreamCommentsDiv.scrollTop = livestreamCommentsDiv.scrollHeight;
              }}
            />

            {/* the button to show superchats listed by most to least support amount */}
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_SUPER_CHAT,
              })}
              label={
                <>
                  <CreditAmount amount={superChatsLBCAmount || 0} size={8} /> /
                  <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {__('Tipped')}
                </>
              }
              onClick={() => {
                resolveSuperChat();
                setViewMode(VIEW_MODE_SUPER_CHAT);
              }}
            />
          </div>
        )}
      </div>
      <>
        {fetchingComments && !commentsByChronologicalOrder && (
          <div className="main--empty">
            <Spinner />
          </div>
        )}
        <div ref={commentsRef} className="livestream__comments-wrapper">
          {viewMode === VIEW_MODE_CHAT && superChatsByTipAmount && hasSuperChats && (
            <div className="livestream-superchats__wrapper">
              <div className="livestream-superchats__inner">
                {superChatTopTen.map((superChat: Comment) => {
                  const isSticker = stickerSuperChats && stickerSuperChats.includes(superChat);

                  const SuperChatWrapper = !isSticker
                    ? ({ children }) => <Tooltip label={superChat.comment}>{children}</Tooltip>
                    : ({ children }) => <>{children}</>;

                  return (
                    <SuperChatWrapper key={superChat.comment_id}>
                      <div className="livestream-superchat">
                        <div className="livestream-superchat__thumbnail">
                          <ChannelThumbnail uri={superChat.channel_url} xsmall />
                        </div>

                        <div
                          className={classnames('livestream-superchat__info', {
                            'livestream-superchat__info--sticker': isSticker,
                            'livestream-superchat__info--not-sticker': stickerSuperChats && !isSticker,
                          })}
                        >
                          <div className="livestream-superchat__info--user">
                            <UriIndicator uri={superChat.channel_url} link />
                            <CreditAmount
                              size={10}
                              className="livestream-superchat__amount-large"
                              amount={superChat.support_amount}
                              isFiat={superChat.is_fiat}
                            />
                          </div>
                          {stickerSuperChats.includes(superChat) && getStickerUrl(superChat.comment) && (
                            <div className="livestream-superchat__info--image">
                              <OptimizedImage src={getStickerUrl(superChat.comment)} waitLoad loading="lazy" />
                            </div>
                          )}
                        </div>
                      </div>
                    </SuperChatWrapper>
                  );
                })}
                {showMoreSuperChatsButton && (
                  <Button
                    title={__('Show More...')}
                    button="inverse"
                    className="close-button"
                    onClick={() => {
                      resolveSuperChat();
                      setViewMode(VIEW_MODE_SUPER_CHAT);
                    }}
                    icon={ICONS.MORE}
                  />
                )}
              </div>
            </div>
          )}

          {pinnedComment && showPinned && viewMode === VIEW_MODE_CHAT && (
            <div className="livestream-pinned__wrapper">
              <LivestreamComment
                key={pinnedComment.comment_id}
                uri={uri}
                authorUri={pinnedComment.channel_url}
                commentId={pinnedComment.comment_id}
                message={pinnedComment.comment}
                supportAmount={pinnedComment.support_amount}
                isModerator={pinnedComment.is_moderator}
                isGlobalMod={pinnedComment.is_global_mod}
                isFiat={pinnedComment.is_fiat}
                isPinned={pinnedComment.is_pinned}
                commentIsMine={pinnedComment.channel_id && isMyComment(pinnedComment.channel_id)}
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

          {/* top to bottom comment display */}
          {!fetchingComments && commentsByChronologicalOrder.length > 0 ? (
            <div className="livestream__comments">
              {viewMode === VIEW_MODE_CHAT &&
                commentsToDisplay.map((comment) => (
                  <LivestreamComment
                    key={comment.comment_id}
                    uri={uri}
                    authorUri={comment.channel_url}
                    commentId={comment.comment_id}
                    message={comment.comment}
                    supportAmount={comment.support_amount}
                    isModerator={comment.is_moderator}
                    isGlobalMod={comment.is_global_mod}
                    isFiat={comment.is_fiat}
                    commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                  />
                ))}

              {viewMode === VIEW_MODE_SUPER_CHAT && resolvingSuperChat && (
                <div className="main--empty">
                  <Spinner />
                </div>
              )}

              {viewMode === VIEW_MODE_SUPER_CHAT &&
                !resolvingSuperChat &&
                superChatsReversed &&
                superChatsReversed.map((comment) => (
                  <LivestreamComment
                    key={comment.comment_id}
                    uri={uri}
                    authorUri={comment.channel_url}
                    commentId={comment.comment_id}
                    message={comment.comment}
                    supportAmount={comment.support_amount}
                    isModerator={comment.is_moderator}
                    isGlobalMod={comment.is_global_mod}
                    isFiat={comment.is_fiat}
                    commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                  />
                ))}
            </div>
          ) : (
            <div className="main--empty" style={{ flex: 1 }} />
          )}

          {scrollPos < 0 && viewMode === VIEW_MODE_CHAT && (
            <Button
              button="secondary"
              className="livestream__comments__scroll-to-recent"
              label={__('Recent Comments')}
              onClick={restoreScrollPos}
              iconRight={ICONS.DOWN}
            />
          )}

          <div className="livestream__comment-create">
            <CommentCreate livestream bottom embed={embed} uri={uri} onDoneReplying={restoreScrollPos} />
          </div>
        </div>
      </>
    </div>
  );
}
