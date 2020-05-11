// @flow
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'util/object';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import Expandable from 'component/expandable';
import MarkdownPreview from 'component/common/markdown-preview';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';
import { FormField, Form } from 'component/common/form';
import CommentCreate from 'component/commentCreate';
import classnames from 'classnames';

type Props = {
  uri: string,
  author: ?string, // LBRY Channel Name, e.g. @channel
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
  parentId: string, // sha256 digest identifying the parent of the comment
  message: string, // comment body
  timePosted: number, // Comment timestamp
  channel: ?Claim, // Channel Claim, retrieved to obtain thumbnail
  pending?: boolean,
  resolveUri: string => void, // resolves the URI
  isResolvingUri: boolean, // if the URI is currently being resolved
  channelIsBlocked: boolean, // if the channel is blacklisted in the app
  claimIsMine: boolean, // if you control the claim which this comment was posted on
  commentIsMine: boolean, // if this comment was signed by an owned channel
  updateComment: (string, string) => void,
  deleteComment: string => void,
};

const LENGTH_TO_COLLAPSE = 300;
const ESCAPE_KEY = 27;

function Comment(props: Props) {
  const {
    uri,
    author,
    authorUri,
    timePosted,
    message,
    pending,
    channel,
    isResolvingUri,
    resolveUri,
    channelIsBlocked,
    commentIsMine,
    commentId,
    parentId,
    updateComment,
    deleteComment,
  } = props;

  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [charCount, setCharCount] = useState(editedMessage.length);

  // used for controlling the visibility of the menu icon
  const [mouseIsHovering, setMouseHover] = useState(false);

  // used for controlling visibility of reply comment component
  const [isReplying, setReplying] = useState(false);

  // to debounce subsequent requests
  const shouldFetch =
    channel === undefined ||
    (channel !== null && channel.value_type === 'channel' && isEmpty(channel.meta) && !pending);

  useEffect(() => {
    // If author was extracted from the URI, then it must be valid.
    if (authorUri && author && !isResolvingUri && shouldFetch) {
      resolveUri(authorUri);
    }

    if (isEditing) {
      setCharCount(editedMessage.length);

      // a user will try and press the escape key to cancel editing their comment
      const handleEscape = event => {
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
  }, [isResolvingUri, shouldFetch, author, authorUri, resolveUri, editedMessage, isEditing, setEditing]);

  function handleSetEditing() {
    setEditing(true);
  }

  function handleEditMessageChanged(event) {
    setCommentValue(event.target.value);
  }

  function handleSubmit() {
    updateComment(commentId, editedMessage);
    setEditing(false);
    setReplying(false);
  }

  function handleDeleteComment() {
    deleteComment(commentId);
  }

  function handleReply() {
    setReplying(true);
  }

  function handleMouseOver() {
    setMouseHover(true);
  }

  function handleMouseOut() {
    setMouseHover(false);
  }

  return (
    <li
      className={classnames('comment', { comment__reply: parentId !== null })}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="comment__author-thumbnail">
        {authorUri ? <ChannelThumbnail uri={authorUri} obscure={channelIsBlocked} small /> : <ChannelThumbnail small />}
      </div>

      <div className="comment__body_container">
        <div className="comment__meta">
          <div className="comment__meta-information">
            {!author ? (
              <span className="comment__author">{__('Anonymous')}</span>
            ) : (
              <Button
                className="button--uri-indicator truncated-text comment__author"
                navigate={authorUri}
                label={author}
              />
            )}
            <time className="comment__time" dateTime={timePosted}>
              {DateTime.getTimeAgoStr(timePosted)}
            </time>
          </div>
          <div className="comment__menu">
            {commentIsMine && (
              <Menu>
                <MenuButton>
                  <Icon
                    size={18}
                    className={mouseIsHovering ? 'comment__menu-icon--hovering' : 'comment__menu-icon'}
                    icon={ICONS.MORE_VERTICAL}
                  />
                </MenuButton>
                <MenuList className="comment__menu-list">
                  {commentIsMine ? (
                    <React.Fragment>
                      <MenuItem className="comment__menu-option" onSelect={handleSetEditing}>
                        {__('Edit')}
                      </MenuItem>
                      <MenuItem className="comment__menu-option" onSelect={handleDeleteComment}>
                        {__('Delete')}
                      </MenuItem>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </MenuList>
              </Menu>
            )}
          </div>
        </div>
        <div>
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <FormField
                type="textarea"
                name="editing_comment"
                value={editedMessage}
                charCount={charCount}
                onChange={handleEditMessageChanged}
              />
              <div className="section__actions">
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
          ) : editedMessage.length >= LENGTH_TO_COLLAPSE ? (
            <div className="comment__message">
              <Expandable>
                <MarkdownPreview content={message} />
              </Expandable>
            </div>
          ) : (
            <div className="comment__message">
              <MarkdownPreview content={message} />
            </div>
          )}
        </div>
        {!parentId && (
          <Button
            button="link"
            requiresAuth={IS_WEB}
            className="comment__reply-button"
            onClick={handleReply}
            label={__('Reply')}
          />
        )}
        <div>
          {isReplying ? (
            <CommentCreate
              uri={uri}
              parentId={commentId}
              onDoneReplying={() => setReplying(false)}
              onCancelReplying={() => setReplying(false)}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </li>
  );
}

export default Comment;
