// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { FF_MAX_CHARS_IN_COMMENT } from 'constants/form-field';
import { SITE_NAME, SIMPLE_SITE, ENABLE_COMMENT_REACTIONS } from 'config';
import React, { useEffect, useState } from 'react';
import { parseURI } from 'lbry-redux';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import Expandable from 'component/expandable';
import MarkdownPreview from 'component/common/markdown-preview';
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

type Props = {
  clearPlayingUri: () => void,
  uri: string,
  claim: StreamClaim,
  author: ?string, // LBRY Channel Name, e.g. @channel
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
  message: string, // comment body
  timePosted: number, // Comment timestamp
  channelIsBlocked: boolean, // if the channel is blacklisted in the app
  claimIsMine: boolean, // if you control the claim which this comment was posted on
  commentIsMine: boolean, // if this comment was signed by an owned channel
  updateComment: (string, string) => void,
  commentModBlock: (string) => void,
  linkedComment?: any,
  myChannels: ?Array<ChannelClaim>,
  commentingEnabled: boolean,
  doToast: ({ message: string }) => void,
  isTopLevel?: boolean,
  threadDepth: number,
  isPinned: boolean,
  othersReacts: ?{
    like: number,
    dislike: number,
  },
  commentIdentityChannel: any,
  activeChannelClaim: ?ChannelClaim,
  playingUri: ?PlayingUri,
  stakedLevel: number,
  supportAmount: number,
  isFiat: boolean
};

const LENGTH_TO_COLLAPSE = 300;
const ESCAPE_KEY = 27;

function Comment(props: Props) {
  const {
    clearPlayingUri,
    claim,
    uri,
    author,
    authorUri,
    timePosted,
    message,
    channelIsBlocked,
    commentIsMine,
    commentId,
    updateComment,
    linkedComment,
    commentingEnabled,
    myChannels,
    doToast,
    isTopLevel,
    threadDepth,
    isPinned,
    othersReacts,
    playingUri,
    stakedLevel,
    supportAmount,
    isFiat,
  } = props;
  const {
    push,
    replace,
    location: { pathname, search },
  } = useHistory();
  const [isReplying, setReplying] = React.useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [charCount, setCharCount] = useState(editedMessage.length);
  // used for controlling the visibility of the menu icon
  const [mouseIsHovering, setMouseHover] = useState(false);
  const [advancedEditor] = usePersistedState('comment-editor-mode', false);
  const [displayDeadComment, setDisplayDeadComment] = React.useState(false);
  const hasChannels = myChannels && myChannels.length > 0;
  const likesCount = (othersReacts && othersReacts.like) || 0;
  const dislikesCount = (othersReacts && othersReacts.dislike) || 0;
  const totalLikesAndDislikes = likesCount + dislikesCount;
  const slimedToDeath = totalLikesAndDislikes >= 5 && dislikesCount / totalLikesAndDislikes > 0.8;
  const commentByOwnerOfContent = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;

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
        if (event.keyCode === ESCAPE_KEY) {
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

  function handleEditMessageChanged(event) {
    setCommentValue(!SIMPLE_SITE && advancedEditor ? event : event.target.value);
  }

  function handleEditComment() {
    if (playingUri && playingUri.source === 'comment') {
      clearPlayingUri();
    }
    setEditing(true);
  }

  function handleSubmit() {
    updateComment(commentId, editedMessage);
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
    const urlParams = new URLSearchParams(search);
    urlParams.delete('lc');
    urlParams.append('lc', commentId);
    replace(`${pathname}?${urlParams.toString()}`);
  }

  return (
    <li
      className={classnames('comment', {
        'comment--top-level': isTopLevel,
        'comment--reply': !isTopLevel,
        'comment--superchat': supportAmount > 0,
      })}
      id={commentId}
      onMouseOver={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
    >
      <div
        className={classnames('comment__content', {
          'comment--highlighted': linkedComment && linkedComment.comment_id === commentId,
          'comment--slimed': slimedToDeath && !displayDeadComment,
        })}
      >
        <div className="comment__thumbnail-wrapper">
          {authorUri ? (
            <ChannelThumbnail uri={authorUri} obscure={channelIsBlocked} xsmall className="comment__author-thumbnail" />
          ) : (
            <ChannelThumbnail xsmall className="comment__author-thumbnail" />
          )}
        </div>

        <div className="comment__body-container">
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
                />
              )}
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
                  <Icon
                    size={18}
                    className={mouseIsHovering ? 'comment__menu-icon--hovering' : 'comment__menu-icon'}
                    icon={ICONS.MORE_VERTICAL}
                  />
                </MenuButton>
                <CommentMenuList
                  uri={uri}
                  isTopLevel={isTopLevel}
                  isPinned={isPinned}
                  commentId={commentId}
                  authorUri={authorUri}
                  commentIsMine={commentIsMine}
                  handleEditComment={handleEditComment}
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
                  ) : editedMessage.length >= LENGTH_TO_COLLAPSE ? (
                    <Expandable>
                      <MarkdownPreview
                        content={message}
                        promptLinks
                        parentCommentId={commentId}
                        stakedLevel={stakedLevel}
                      />
                    </Expandable>
                  ) : (
                    <MarkdownPreview
                      content={message}
                      promptLinks
                      parentCommentId={commentId}
                      stakedLevel={stakedLevel}
                    />
                  )}
                </div>

                <div className="comment__actions">
                  {threadDepth !== 0 && (
                    <Button
                      requiresAuth={IS_WEB}
                      label={commentingEnabled ? __('Reply') : __('Log in to reply')}
                      className="comment__action"
                      onClick={handleCommentReply}
                      icon={ICONS.REPLY}
                    />
                  )}
                  {ENABLE_COMMENT_REACTIONS && <CommentReactions uri={uri} commentId={commentId} />}
                </div>

                {isReplying && (
                  <CommentCreate
                    isReply
                    uri={uri}
                    parentId={commentId}
                    onDoneReplying={() => setReplying(false)}
                    onCancelReplying={() => setReplying(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CommentsReplies threadDepth={threadDepth - 1} uri={uri} parentId={commentId} linkedComment={linkedComment} />
    </li>
  );
}

export default Comment;
