/**
 * Comment component.
 *
 * Notes:
 * - Filtration is not done at this component level. Comments are filtered
 *   in the selector through `filterComments()`. This saves the need to handle
 *   it from the render loop, but also means we cannot render it differently
 *   (e.g. displaying as "Comment has been blocked") since the component doesn't
 *   see it.
 */

// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as KEYCODES from 'constants/keycodes';
import { COMMENT_HIGHLIGHTED } from 'constants/classnames';
import {
  SORT_BY,
  COMMENT_PAGE_SIZE_REPLIES,
  LINKED_COMMENT_QUERY_PARAM,
  THREAD_COMMENT_QUERY_PARAM,
} from 'constants/comment';
import { FF_MAX_CHARS_IN_COMMENT } from 'constants/form-field';
import { SITE_NAME, SIMPLE_SITE, ENABLE_COMMENT_REACTIONS } from 'config';
import React, { useEffect, useState } from 'react';
import { parseURI } from 'util/lbryURI';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import Expandable from 'component/expandable';
import MarkdownPreview from 'component/common/markdown-preview';
import CommentBadge from 'component/common/comment-badge';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuButton } from '@reach/menu-button';
import Icon from 'component/common/icon';
import { FormField, Form } from 'component/common/form';
import classnames from 'classnames';
import usePersistedState from 'effects/use-persisted-state';
import CommentReactions from 'component/commentReactions';
import CommentsReplies from 'component/commentsReplies';
import { useHistory } from 'react-router';
import CommentCreate from 'component/commentCreate';
import CommentMenuList from 'component/commentMenuList';
import UriIndicator from 'component/uriIndicator';
import CreditAmount from 'component/common/credit-amount';
import OptimizedImage from 'component/optimizedImage';
import { getChannelFromClaim } from 'util/claim';
import { parseSticker } from 'util/comments';
import { useIsMobile } from 'effects/use-screensize';
import PremiumBadge from 'component/premiumBadge';
import Spinner from 'component/spinner';

const AUTO_EXPAND_ALL_REPLIES = false;

type Props = {
  comment: Comment,
  myChannelIds: ?Array<string>,
  clearPlayingUri: () => void,
  uri: string,
  claim: StreamClaim,
  claimIsMine: boolean, // if you control the claim which this comment was posted on
  updateComment: (string, string) => void,
  fetchReplies: (string, string, number, number, number) => void,
  totalReplyPages: number,
  commentModBlock: (string) => void,
  linkedCommentId?: string,
  threadCommentId?: string,
  linkedCommentAncestors: { [string]: Array<string> },
  hasChannels: boolean,
  commentingEnabled: boolean,
  doToast: ({ message: string }) => void,
  isTopLevel?: boolean,
  hideActions?: boolean,
  othersReacts: ?{
    like: number,
    dislike: number,
  },
  commentIdentityChannel: any,
  activeChannelClaim: ?ChannelClaim,
  playingUri: PlayingUri,
  stakedLevel: number,
  supportDisabled: boolean,
  setQuickReply: (any) => void,
  quickReply: any,
  commenterMembership: ?string,
  fetchedReplies: Array<Comment>,
  repliesFetching: boolean,
  threadLevel?: number,
  threadDepthLevel?: number,
};

const LENGTH_TO_COLLAPSE = 300;

function CommentView(props: Props) {
  const {
    comment,
    myChannelIds,
    clearPlayingUri,
    claim,
    uri,
    updateComment,
    fetchReplies,
    totalReplyPages,
    linkedCommentId,
    threadCommentId,
    linkedCommentAncestors,
    commentingEnabled,
    hasChannels,
    doToast,
    isTopLevel,
    hideActions,
    othersReacts,
    playingUri,
    stakedLevel,
    supportDisabled,
    setQuickReply,
    quickReply,
    commenterMembership,
    fetchedReplies,
    repliesFetching,
    threadLevel = 0,
    threadDepthLevel = 0,
  } = props;

  const {
    channel_url: authorUri,
    channel_name: author,
    channel_id: channelId,
    comment_id: commentId,
    comment: message,
    is_fiat: isFiat,
    is_global_mod: isGlobalMod,
    is_moderator: isModerator,
    is_pinned: isPinned,
    support_amount: supportAmount,
    replies: numDirectReplies,
    timestamp,
  } = comment;

  const timePosted = timestamp * 1000;
  const commentIsMine = channelId && myChannelIds && myChannelIds.includes(channelId);

  const isMobile = useIsMobile();
  const ROUGH_HEADER_HEIGHT = isMobile ? 56 : 60; // @see: --header-height

  const lastThreadLevel = threadDepthLevel - 1;
  // Mobile: 0, 1, 2 -> new thread....., so each 3 comments
  const openNewThread = threadLevel > 0 && threadLevel % lastThreadLevel === 0;

  const {
    push,
    replace,
    location: { pathname, search },
  } = useHistory();

  const urlParams = new URLSearchParams(search);
  const isLinkedComment = linkedCommentId && linkedCommentId === commentId;
  const isThreadComment = threadCommentId && threadCommentId === commentId;
  const isInLinkedCommentChain =
    linkedCommentId &&
    linkedCommentAncestors[linkedCommentId] &&
    linkedCommentAncestors[linkedCommentId].includes(commentId);
  const showRepliesOnMount = isThreadComment || isInLinkedCommentChain || AUTO_EXPAND_ALL_REPLIES;

  const [isReplying, setReplying] = React.useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [charCount, setCharCount] = useState(editedMessage.length);
  const [showReplies, setShowReplies] = useState(showRepliesOnMount);
  const [page, setPage] = useState(showRepliesOnMount ? 1 : 0);
  const [advancedEditor] = usePersistedState('comment-editor-mode', false);
  const [displayDeadComment, setDisplayDeadComment] = React.useState(false);
  const likesCount = (othersReacts && othersReacts.like) || 0;
  const dislikesCount = (othersReacts && othersReacts.dislike) || 0;
  const totalLikesAndDislikes = likesCount + dislikesCount;
  const slimedToDeath = totalLikesAndDislikes >= 5 && dislikesCount / totalLikesAndDislikes > 0.8;
  const contentChannelClaim = getChannelFromClaim(claim);
  const commentByOwnerOfContent = contentChannelClaim && contentChannelClaim.permanent_url === authorUri;
  const stickerFromMessage = parseSticker(message);
  const isExpandable = editedMessage.length >= LENGTH_TO_COLLAPSE;

  let channelOwnerOfContent;
  try {
    const { channelName } = parseURI(uri);
    if (channelName) {
      channelOwnerOfContent = channelName;
    }
  } catch (e) {}

  useEffect(() => {
    if (isEditing) {
      setCharCount(editedMessage.length);

      // a user will try and press the escape key to cancel editing their comment
      const handleEscape = (event) => {
        if (event.keyCode === KEYCODES.ESCAPE) {
          setEditing(false);
        }
      };

      window.addEventListener('keydown', handleEscape);

      // removes the listener so it doesn't cause problems elsewhere in the app
      return () => {
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [author, authorUri, editedMessage, isEditing, setEditing]);

  useEffect(() => {
    if (page > 0) {
      fetchReplies(uri, commentId, page, COMMENT_PAGE_SIZE_REPLIES, SORT_BY.OLDEST);
    }
  }, [page, uri, commentId, fetchReplies]);

  function handleEditMessageChanged(event) {
    setCommentValue(!SIMPLE_SITE && advancedEditor ? event : event.target.value);
  }

  function handleEditComment() {
    if (playingUri.source === 'comment') {
      clearPlayingUri();
    }
    setEditing(true);
  }

  function handleSubmit() {
    updateComment(commentId, editedMessage);
    if (setQuickReply) setQuickReply({ ...quickReply, comment_id: commentId, comment: editedMessage });
    setEditing(false);
  }

  function handleCommentReply() {
    if (!hasChannels) {
      push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`);
      doToast({ message: __('A channel is required to comment on %SITE_NAME%', { SITE_NAME }) });
    } else {
      setReplying(!isReplying);
    }
  }

  function handleTimeClick() {
    urlParams.set(LINKED_COMMENT_QUERY_PARAM, commentId);
    replace(`${pathname}?${urlParams.toString()}`);
  }

  function handleOpenNewThread() {
    urlParams.set(LINKED_COMMENT_QUERY_PARAM, commentId);
    urlParams.set(THREAD_COMMENT_QUERY_PARAM, commentId);
    push({ pathname, search: urlParams.toString() });
  }

  const linkedCommentRef = React.useCallback(
    (node) => {
      if (node !== null && window.pendingLinkedCommentScroll) {
        delete window.pendingLinkedCommentScroll;

        const mobileChatElem = document.querySelector('.MuiPaper-root .card--enable-overflow');
        const elem = (isMobile && mobileChatElem) || window;

        if (elem) {
          // $FlowFixMe
          elem.scrollTo({
            // $FlowFixMe
            top: node.getBoundingClientRect().top + (mobileChatElem ? 0 : elem.scrollY) - ROUGH_HEADER_HEIGHT,
            left: 0,
            behavior: 'smooth',
          });
        }
      }
    },
    [ROUGH_HEADER_HEIGHT, isMobile]
  );

  return (
    <li
      className={classnames('comment', {
        'comment--top-level': isTopLevel,
        'comment--reply': !isTopLevel,
        'comment--superchat': supportAmount > 0,
      })}
      id={commentId}
    >
      <div className="comment__thumbnail-wrapper">
        {authorUri ? (
          <ChannelThumbnail uri={authorUri} xsmall className="comment__author-thumbnail" checkMembership={false} />
        ) : (
          <ChannelThumbnail xsmall className="comment__author-thumbnail" checkMembership={false} />
        )}

        {numDirectReplies > 0 && showReplies && (
          <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setShowReplies(false)} />
        )}
      </div>

      <div className="comment__content" ref={isLinkedComment || isThreadComment ? linkedCommentRef : undefined}>
        <div
          className={classnames('comment__body-container', {
            [COMMENT_HIGHLIGHTED]: isLinkedComment || (isThreadComment && !linkedCommentId),
            'comment--slimed': slimedToDeath && !displayDeadComment,
          })}
        >
          <div className="comment__meta">
            <div className="comment__meta-information">
              {!author ? (
                <span className="comment__author">{__('Anonymous')}</span>
              ) : (
                <UriIndicator
                  className={classnames('comment__author', {
                    'comment__author--creator': commentByOwnerOfContent,
                  })}
                  link
                  uri={authorUri}
                  comment
                  showAtSign
                />
              )}
              {isGlobalMod && <CommentBadge label={__('Admin')} icon={ICONS.BADGE_ADMIN} />}
              {isModerator && <CommentBadge label={__('Moderator')} icon={ICONS.BADGE_MOD} />}
              <PremiumBadge membership={commenterMembership} linkPage />
              <Button
                className="comment__time"
                onClick={handleTimeClick}
                label={<DateTime date={timePosted} timeAgo />}
              />

              {supportAmount > 0 && <CreditAmount isFiat={isFiat} amount={supportAmount} superChatLight size={12} />}

              {isPinned && (
                <span className="comment__pin">
                  <Icon icon={ICONS.PIN} size={14} />
                  {channelOwnerOfContent
                    ? __('Pinned by @%channel%', { channel: channelOwnerOfContent })
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
                  handleEditComment={handleEditComment}
                  supportAmount={supportAmount}
                  setQuickReply={setQuickReply}
                />
              </Menu>
            </div>
          </div>
          <div>
            {isEditing ? (
              <Form onSubmit={handleSubmit}>
                <FormField
                  className="comment__edit-input"
                  type={!SIMPLE_SITE && advancedEditor ? 'markdown' : 'textarea'}
                  name="editing_comment"
                  value={editedMessage}
                  charCount={charCount}
                  onChange={handleEditMessageChanged}
                  textAreaMaxLength={FF_MAX_CHARS_IN_COMMENT}
                  handleSubmit={handleSubmit}
                />
                <div className="section__actions section__actions--no-margin">
                  <Button
                    button="primary"
                    type="submit"
                    label={__('Done')}
                    requiresAuth={IS_WEB}
                    disabled={message === editedMessage}
                  />
                  <Button button="link" label={__('Cancel')} onClick={() => setEditing(false)} />
                </div>
              </Form>
            ) : (
              <>
                <div className="comment__message">
                  {slimedToDeath && !displayDeadComment ? (
                    <div onClick={() => setDisplayDeadComment(true)} className="comment__dead">
                      {__('This comment was slimed to death.')} <Icon icon={ICONS.SLIME_ACTIVE} />
                    </div>
                  ) : stickerFromMessage ? (
                    <div className="sticker__comment">
                      <OptimizedImage src={stickerFromMessage.url} waitLoad loading="lazy" />
                    </div>
                  ) : isExpandable ? (
                    <Expandable beginCollapsed>
                      <MarkdownPreview
                        content={message}
                        promptLinks
                        parentCommentId={commentId}
                        stakedLevel={stakedLevel}
                        hasMembership={Boolean(commenterMembership)}
                      />
                    </Expandable>
                  ) : (
                    <MarkdownPreview
                      content={message}
                      promptLinks
                      parentCommentId={commentId}
                      stakedLevel={stakedLevel}
                      hasMembership={Boolean(commenterMembership)}
                    />
                  )}
                </div>

                {!hideActions && (
                  <div className="comment__actions">
                    <Button
                      requiresAuth={IS_WEB}
                      label={commentingEnabled ? __('Reply') : __('Log in to reply')}
                      className="comment__action"
                      onClick={handleCommentReply}
                      icon={ICONS.REPLY}
                      iconSize={isMobile && 12}
                    />
                    {ENABLE_COMMENT_REACTIONS && <CommentReactions uri={uri} commentId={commentId} />}
                  </div>
                )}

                {repliesFetching && (!fetchedReplies || fetchedReplies.length === 0) ? (
                  <span className="comment__actions comment__replies-loading">
                    <Spinner text={numDirectReplies > 1 ? __('Loading Replies') : __('Loading Reply')} type="small" />
                  </span>
                ) : (
                  numDirectReplies > 0 && (
                    <div className="comment__actions">
                      {!showReplies ? (
                        openNewThread ? (
                          <Button
                            label={__('Continue Thread')}
                            button="link"
                            onClick={handleOpenNewThread}
                            iconRight={ICONS.ARROW_RIGHT}
                          />
                        ) : (
                          <Button
                            label={
                              numDirectReplies < 2
                                ? __('Show reply')
                                : __('Show %count% replies', { count: numDirectReplies })
                            }
                            button="link"
                            onClick={() => {
                              setShowReplies(true);
                              if (page === 0) {
                                setPage(1);
                              }
                            }}
                            iconRight={ICONS.DOWN}
                          />
                        )
                      ) : (
                        <Button
                          label={__('Hide replies')}
                          button="link"
                          onClick={() => setShowReplies(false)}
                          iconRight={ICONS.UP}
                        />
                      )}
                    </div>
                  )
                )}

                {isReplying && (
                  <CommentCreate
                    isReply
                    uri={uri}
                    parentId={commentId}
                    onDoneReplying={() => {
                      if (openNewThread) {
                        handleOpenNewThread();
                      } else {
                        setShowReplies(true);
                      }
                      setReplying(false);
                    }}
                    onCancelReplying={() => {
                      setReplying(false);
                    }}
                    supportDisabled={supportDisabled}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {showReplies && (
          <CommentsReplies
            threadLevel={threadLevel}
            uri={uri}
            parentId={commentId}
            linkedCommentId={linkedCommentId}
            threadCommentId={threadCommentId}
            numDirectReplies={numDirectReplies}
            onShowMore={() => setPage(page + 1)}
            hasMore={page < totalReplyPages}
            threadDepthLevel={threadDepthLevel}
          />
        )}
      </div>
    </li>
  );
}

export default CommentView;
