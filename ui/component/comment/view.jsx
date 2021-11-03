// @flow
import 'scss/component/_comments.scss';
import { ENABLE_COMMENT_REACTIONS } from 'config';
import { Menu, MenuButton } from '@reach/menu-button';
import { parseSticker } from 'util/comments';
import { parseURI } from 'util/lbryURI';
import { SORT_BY, COMMENT_PAGE_SIZE_REPLIES } from 'constants/comment';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CommentMenuList from 'component/commentMenuList';
import CommentReactions from 'component/commentReactions';
import CommentsReplies from 'component/commentsReplies';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Expandable from 'component/expandable';
import Icon from 'component/common/icon';
import MarkdownPreview from 'component/common/markdown-preview';
import OptimizedImage from 'component/optimizedImage';
import React, { useEffect, useState } from 'react';
import Tooltip from 'component/common/tooltip';
import UriIndicator from 'component/uriIndicator';

const AUTO_EXPAND_ALL_REPLIES = false;
const LENGTH_TO_COLLAPSE = 300;

type Props = {
  channelIsBlocked: boolean, // if the channel is blacklisted in the app
  claim: StreamClaim,
  claimIsMine: boolean, // if you control the claim which this comment was posted on
  comment: Comment,
  commentIdentityChannel: any,
  hideActions?: boolean,
  isTopLevel?: boolean,
  linkedCommentAncestors: { [string]: Array<string> },
  linkedCommentId?: string,
  myChannels: ?Array<ChannelClaim>,
  othersReacts: ?{ like: number, dislike: number },
  playingUri: ?PlayingUri,
  quickReply: any,
  stakedLevel: number,
  supportDisabled: boolean,
  threadDepth: number,
  totalReplyPages: number,
  uri: string,
  userCanComment: boolean,
  clearPlayingUri: () => void,
  commentModBlock: (string) => void,
  fetchReplies: (number, number, string) => void,
  setQuickReply: (any) => void,
  updateComment: (string) => void,
};

function CommentView(props: Props) {
  const {
    channelIsBlocked,
    claim,
    comment,
    hideActions,
    isTopLevel,
    linkedCommentAncestors,
    linkedCommentId,
    myChannels,
    othersReacts,
    playingUri,
    quickReply,
    stakedLevel,
    supportDisabled,
    threadDepth,
    totalReplyPages,
    uri,
    userCanComment,
    clearPlayingUri,
    fetchReplies,
    setQuickReply,
    updateComment,
  } = props;

  const {
    channel_id: authorId,
    channel_url: authorUri,
    comment_id: commentId,
    comment: message,
    is_fiat: isFiat,
    is_global_mod: isGlobalMod,
    is_moderator: isModerator,
    is_pinned: isPinned,
    replies: numDirectReplies,
    support_amount: supportAmount,
  } = comment;
  const timePosted = comment.timestamp * 1000;
  const commentIsMine = authorId && myChannels && myChannels.some(({ claim_id }) => claim_id === authorId);

  const {
    replace,
    location: { pathname, search },
  } = useHistory();

  const isLinkedComment = linkedCommentId && linkedCommentId === commentId;
  const isInLinkedCommentChain =
    linkedCommentId &&
    linkedCommentAncestors[linkedCommentId] &&
    linkedCommentAncestors[linkedCommentId].includes(commentId);
  const showRepliesOnMount = isInLinkedCommentChain || AUTO_EXPAND_ALL_REPLIES;

  const [isReplying, setReplying] = React.useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [showReplies, setShowReplies] = useState(showRepliesOnMount);
  const [page, setPage] = useState(showRepliesOnMount ? 1 : 0);
  const [displayDeadComment, setDisplayDeadComment] = React.useState(false);

  const likesCount = (othersReacts && othersReacts.like) || 0;
  const dislikesCount = (othersReacts && othersReacts.dislike) || 0;
  const totalLikesAndDislikes = likesCount + dislikesCount;
  const slimedToDeath = totalLikesAndDislikes >= 5 && dislikesCount / totalLikesAndDislikes > 0.8;
  const commentByContentOwner = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const stickerFromMessage = parseSticker(message);

  let contentOwnerChannel;
  try {
    ({ channelName: contentOwnerChannel } = parseURI(uri));
  } catch (e) {}

  function handleTimeClick() {
    const urlParams = new URLSearchParams(search);
    urlParams.delete('lc');
    urlParams.append('lc', commentId);
    replace(`${pathname}?${urlParams.toString()}`);
  }

  const linkedCommentRef = React.useCallback((node) => {
    if (node !== null && window.pendingLinkedCommentScroll) {
      const ROUGH_HEADER_HEIGHT = 125; // @see: --header-height
      delete window.pendingLinkedCommentScroll;
      window.scrollTo({
        top: node.getBoundingClientRect().top + window.scrollY - ROUGH_HEADER_HEIGHT,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    if (page > 0) fetchReplies(page, COMMENT_PAGE_SIZE_REPLIES, SORT_BY.OLDEST);
  }, [commentId, fetchReplies, page, uri]);

  const commentBadge = (label: string, className: string, icon: string) => (
    <Tooltip label={label}>
      <span className={`comment__badge ${className}`}>
        <Icon icon={icon} size={20} />
      </span>
    </Tooltip>
  );

  const MarkdownWrapper =
    editedMessage.length >= LENGTH_TO_COLLAPSE
      ? ({ children }) => <Expandable>{children}</Expandable>
      : ({ children }) => children;

  return (
    <li
      className={classnames('comment', {
        'comment--topLevel': isTopLevel,
        'comment--reply': !isTopLevel,
        'comment--superchat': supportAmount > 0,
      })}
      id={commentId}
    >
      <div
        ref={isLinkedComment ? linkedCommentRef : undefined}
        className={classnames('comment__content', {
          'comment__content--highlighted': isLinkedComment,
          'comment__content--slimed': slimedToDeath && !displayDeadComment,
        })}
      >
        <div className="commentThumbnail__wrapper">
          <ChannelThumbnail uri={authorUri} obscure={channelIsBlocked} xsmall className="commentAuthor__thumbnail" />
        </div>

        <div className="commentBody__container">
          <div className="comment__meta">
            <div className="commentMeta__information">
              {isModerator && commentBadge(__('Moderator'), 'commentBadge__mod', ICONS.BADGE_MOD)}
              {isGlobalMod && commentBadge(__('Admin'), 'commentBadge__globalMod', ICONS.BADGE_MOD)}

              <UriIndicator
                uri={authorUri}
                className={classnames('comment__author', { 'comment__author--creator': commentByContentOwner })}
                link
              />
              <Button
                className="comment__time"
                onClick={handleTimeClick}
                label={<DateTime date={timePosted} timeAgo />}
              />

              {supportAmount > 0 && <CreditAmount isFiat={isFiat} amount={supportAmount} superChatLight size={12} />}

              {isPinned && (
                <span className="comment__pin">
                  <Icon icon={ICONS.PIN} size={14} />
                  {contentOwnerChannel
                    ? __('Pinned by @%channel%', { channel: contentOwnerChannel })
                    : __('Pinned by creator')}
                </span>
              )}
            </div>
            <div className="comment__menu">
              <Menu>
                <MenuButton className="menu__button">
                  <Icon size={18} icon={ICONS.MORE_VERTICAL} />
                </MenuButton>
                <CommentMenuList
                  uri={uri}
                  isTopLevel={isTopLevel}
                  isPinned={isPinned}
                  commentId={commentId}
                  authorUri={authorUri}
                  commentIsMine={commentIsMine}
                  handleEditComment={() => {
                    if (playingUri && playingUri.source === 'comment') clearPlayingUri();
                    setEditing(true);
                  }}
                  supportAmount={supportAmount}
                  setQuickReply={setQuickReply}
                  disableEdit={Boolean(stickerFromMessage)}
                />
              </Menu>
            </div>
          </div>
          <div className="comment__body">
            {isEditing ? (
              <CommentCreate
                isEdit
                editedMessage={message}
                onDoneEditing={(editedMessage) => {
                  if (editedMessage) {
                    updateComment(editedMessage);
                    if (setQuickReply) setQuickReply({ ...quickReply, comment_id: commentId, comment: editedMessage });
                    setCommentValue(editedMessage);
                  }
                  setEditing(false);
                }}
                supportDisabled
              />
            ) : (
              <>
                <div
                  className={classnames('comment__message', {
                    'comment__message--dead': slimedToDeath && !displayDeadComment,
                    'comment__message--sticker': stickerFromMessage,
                  })}
                  onClick={() => slimedToDeath && setDisplayDeadComment(true)}
                >
                  {slimedToDeath && !displayDeadComment ? (
                    <>
                      {__('This comment was slimed to death.')}
                      <Icon icon={ICONS.SLIME_ACTIVE} />
                    </>
                  ) : stickerFromMessage ? (
                    <OptimizedImage src={stickerFromMessage.url} waitLoad />
                  ) : (
                    <MarkdownWrapper>
                      <MarkdownPreview
                        content={message}
                        parentCommentId={commentId}
                        stakedLevel={stakedLevel}
                        promptLinks
                      />
                    </MarkdownWrapper>
                  )}
                </div>

                {!hideActions && (
                  <div className="comment__actions">
                    {threadDepth !== 0 && (
                      <Button
                        requiresAuth
                        label={userCanComment ? __('Reply') : __('Log in to reply')}
                        className="comment__action"
                        onClick={() => setReplying(!isReplying)}
                        icon={ICONS.REPLY}
                      />
                    )}
                    {ENABLE_COMMENT_REACTIONS && <CommentReactions uri={uri} commentId={commentId} />}
                  </div>
                )}

                {numDirectReplies > 0 &&
                  (!showReplies ? (
                    <div className="comment__actions">
                      <Button
                        label={
                          numDirectReplies < 2
                            ? __('Show reply')
                            : __('Show %count% replies', { count: numDirectReplies })
                        }
                        button="link"
                        onClick={() => {
                          setShowReplies(true);
                          if (page === 0) setPage(1);
                        }}
                        icon={ICONS.DOWN}
                      />
                    </div>
                  ) : (
                    <div className="comment__actions">
                      <Button
                        label={__('Hide replies')}
                        button="link"
                        onClick={() => setShowReplies(false)}
                        icon={ICONS.UP}
                      />
                    </div>
                  ))}

                {isReplying && (
                  <CommentCreate
                    isReply
                    uri={uri}
                    parentId={commentId}
                    onDoneReplying={() => {
                      setShowReplies(true);
                      setReplying(false);
                    }}
                    onCancelReplying={() => setReplying(false)}
                    supportDisabled={supportDisabled}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showReplies && (
        <CommentsReplies
          threadDepth={threadDepth - 1}
          uri={uri}
          parentId={commentId}
          linkedCommentId={linkedCommentId}
          numDirectReplies={numDirectReplies}
          onShowMore={() => setPage(page + 1)}
          hasMore={page < totalReplyPages}
        />
      )}
    </li>
  );
}

export default CommentView;
