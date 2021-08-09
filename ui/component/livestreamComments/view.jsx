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

type Props = {
  uri: string,
  claim: ?StreamClaim,
  activeViewers: number,
  embed?: boolean,
  doCommentSocketConnect: (string, string) => void,
  doCommentSocketDisconnect: (string) => void,
  doCommentList: (string, string, number, number) => void,
  comments: Array<Comment>,
  fetchingComments: boolean,
  doSuperChatList: (string) => void,
  superChats: Array<Comment>,
  myChannels: ?Array<ChannelClaim>,
  pinnedCommentsById: { [claimId: string]: Array<string> },
};

const VIEW_MODE_CHAT = 'view_chat';
const VIEW_MODE_SUPER_CHAT = 'view_superchat';
const COMMENT_SCROLL_OFFSET = 100;
const COMMENT_SCROLL_TIMEOUT = 25;

export default function LivestreamComments(props: Props) {
  const {
    claim,
    uri,
    embed,
    doCommentSocketConnect,
    doCommentSocketDisconnect,
    comments: commentsByChronologicalOrder,
    doCommentList,
    fetchingComments,
    doSuperChatList,
    myChannels,
    superChats: superChatsByTipAmount,
    pinnedCommentsById,
  } = props;

  let superChatsFiatAmount, superChatsTotalAmount;

  const commentsRef = React.createRef();
  const [scrollBottom, setScrollBottom] = React.useState(true);
  const [viewMode, setViewMode] = React.useState(VIEW_MODE_CHAT);
  const [performedInitialScroll, setPerformedInitialScroll] = React.useState(false);
  const claimId = claim && claim.claim_id;
  const commentsLength = commentsByChronologicalOrder && commentsByChronologicalOrder.length;
  const commentsToDisplay = viewMode === VIEW_MODE_CHAT ? commentsByChronologicalOrder : superChatsByTipAmount;

  const discussionElement = document.querySelector('.livestream__comments');
  const commentElement = document.querySelector('.livestream-comment');

  let pinnedComment;
  const pinnedCommentIds = (claimId && pinnedCommentsById[claimId]) || [];
  if (pinnedCommentIds.length > 0) {
    pinnedComment = commentsByChronologicalOrder.find((c) => c.comment_id === pinnedCommentIds[0]);
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

  const handleScroll = React.useCallback(() => {
    if (discussionElement) {
      const negativeCommentHeight = commentElement && -1 * commentElement.offsetHeight;
      const isAtRecent = negativeCommentHeight && discussionElement.scrollTop >= negativeCommentHeight;

      setScrollBottom(isAtRecent);
    }
  }, [commentElement, discussionElement]);

  React.useEffect(() => {
    if (discussionElement) {
      discussionElement.addEventListener('scroll', handleScroll);

      if (commentsLength > 0) {
        // Only update comment scroll if the user hasn't scrolled up to view old comments
        // If they have, do nothing
        if (!performedInitialScroll) {
          setTimeout(
            () =>
              (discussionElement.scrollTop =
                discussionElement.scrollHeight - discussionElement.offsetHeight + COMMENT_SCROLL_OFFSET),
            COMMENT_SCROLL_TIMEOUT
          );
          setPerformedInitialScroll(true);
        }
      }

      return () => discussionElement.removeEventListener('scroll', handleScroll);
    }
  }, [commentsLength, discussionElement, handleScroll, performedInitialScroll, setPerformedInitialScroll]);

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
    superChatsTotalAmount = LBCAmount;
  }

  let superChatsReversed;
  // array of superchats organized by fiat or not first, then support amount
  if (superChatsByTipAmount) {
    const clonedSuperchats = JSON.parse(JSON.stringify(superChatsByTipAmount));

    // sort by fiat first then by support amount
    superChatsReversed = clonedSuperchats.sort(function(a, b) {
      // if both are fiat, organize by support
      if (a.is_fiat === b.is_fiat) {
        return b.support_amount - a.support_amount;
        // otherwise, if they are not both fiat, put the fiat transaction first
      } else {
        return (a.is_fiat === b.is_fiat) ? 0 : a.is_fiat ? -1 : 1;
      }
    }).reverse();
  }

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  }

  if (!claim) {
    return null;
  }

  function scrollBack() {
    if (discussionElement) {
      discussionElement.scrollTop = 0;
      setScrollBottom(true);
    }
  }

  return (
    <div className="card livestream__discussion">
      <div className="card__header--between livestream-discussion__header">
        <div className="livestream-discussion__title">{__('Live discussion')}</div>
        {(superChatsTotalAmount || 0) > 0 && (
          <div className="recommended-content__toggles">

            {/* the superchats in chronological order button */}
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_CHAT,
              })}
              label={__('Chat')}
              onClick={function() {
                setViewMode(VIEW_MODE_CHAT);
                const livestreamCommentsDiv = document.getElementsByClassName('livestream__comments')[0];
                const divHeight = livestreamCommentsDiv.scrollHeight;
                livestreamCommentsDiv.scrollTop = divHeight;
              }}
            />

            {/* the button to show superchats listed by most to least support amount */}
            <Button
              className={classnames('button-toggle', {
                'button-toggle--active': viewMode === VIEW_MODE_SUPER_CHAT,
              })}
              label={
                <>
                  <CreditAmount amount={superChatsTotalAmount || 0} size={8} /> /
                  <CreditAmount amount={superChatsFiatAmount || 0} size={8} isFiat /> {' '}{__('Tipped')}
                </>
              }
              onClick={function() {
                setViewMode(VIEW_MODE_SUPER_CHAT);
                const livestreamCommentsDiv = document.getElementsByClassName('livestream__comments')[0];
                const divHeight = livestreamCommentsDiv.scrollHeight;
                livestreamCommentsDiv.scrollTop = divHeight * -1;
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
          {viewMode === VIEW_MODE_CHAT && superChatsByTipAmount && (superChatsTotalAmount || 0) > 0 && (
            <div className="livestream-superchats__wrapper">
              <div className="livestream-superchats__inner">
                {superChatsByTipAmount.map((superChat: Comment) => (
                  <Tooltip key={superChat.comment_id} label={superChat.comment}>
                    <div className="livestream-superchat">
                      <div className="livestream-superchat__thumbnail">
                        <ChannelThumbnail uri={superChat.channel_url} xsmall />
                      </div>

                      <div className="livestream-superchat__info">
                        <UriIndicator uri={superChat.channel_url} link />
                        <CreditAmount
                          size={10}
                          className="livestream-superchat__amount-large"
                          amount={superChat.support_amount}
                          isFiat={superChat.is_fiat}
                        />
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {pinnedComment && (
            <div className="livestream-pinned__wrapper">
              <LivestreamComment
                key={pinnedComment.comment_id}
                uri={uri}
                authorUri={pinnedComment.channel_url}
                commentId={pinnedComment.comment_id}
                message={pinnedComment.comment}
                supportAmount={pinnedComment.support_amount}
                isFiat={pinnedComment.is_fiat}
                isPinned={pinnedComment.is_pinned}
                commentIsMine={pinnedComment.channel_id && isMyComment(pinnedComment.channel_id)}
              />
            </div>
          )}

          {/* top to bottom comment display */}
          {!fetchingComments && commentsByChronologicalOrder.length > 0 ? (
            <div className="livestream__comments">
              {viewMode === VIEW_MODE_CHAT && commentsToDisplay.map((comment) => (
                <LivestreamComment
                  key={comment.comment_id}
                  uri={uri}
                  authorUri={comment.channel_url}
                  commentId={comment.comment_id}
                  message={comment.comment}
                  supportAmount={comment.support_amount}
                  isFiat={comment.is_fiat}
                  commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                />
              ))}

              {viewMode === VIEW_MODE_SUPER_CHAT && superChatsReversed && superChatsReversed.map((comment) => (
                <LivestreamComment
                  key={comment.comment_id}
                  uri={uri}
                  authorUri={comment.channel_url}
                  commentId={comment.comment_id}
                  message={comment.comment}
                  supportAmount={comment.support_amount}
                  isFiat={comment.is_fiat}
                  commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                />
              ))}
            </div>
          ) : (
            <div className="main--empty" style={{ flex: 1 }} />
          )}

          {!scrollBottom && (
            <Button
              button="alt"
              className="livestream__comments-scroll__down"
              label={__('Recent Comments')}
              onClick={scrollBack}
            />
          )}

          <div className="livestream__comment-create">
            <CommentCreate livestream bottom embed={embed} uri={uri} />
          </div>
        </div>
      </>
    </div>
  );
}
