// @flow
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'util/object';
import relativeDate from 'tiny-relative-date';
import Button from 'component/button';
import Expandable from 'component/expandable';
import MarkdownPreview from 'component/common/markdown-preview';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';
import * as ICONS from 'constants/icons';

type Props = {
  author: ?string, // LBRY Channel Name, e.g. @channel
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  message: string, // comment body
  timePosted: number, // Comment timestamp
  claim: ?Claim, // Channel Claim, retrieved to obtain thumbnail
  pending?: boolean,
  resolveUri: string => void, // resolves the URI
  isResolvingUri: boolean, // if the URI is currently being resolved
  channelIsBlocked: boolean, // if the channel is blacklisted in the app
  claimIsMine: boolean, // if you control the claim which this comment was posted on
  commentIsMine: boolean, // if this comment was signed by an owned channel
};

const LENGTH_TO_COLLAPSE = 300;
const ESCAPE_KEY = 27;

function Comment(props: Props) {
  const {
    author,
    authorUri,
    timePosted,
    message,
    pending,
    claim,
    isResolvingUri,
    resolveUri,
    channelIsBlocked,
    claimIsMine,
    commentIsMine,
  } = props;

  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [charCount, setCharCount] = useState(editedMessage.length);

  // used for controlling the visibility of the menu icon
  const [mouseIsHovering, setMouseHover] = useState(false);

  // to debounce subsequent requests
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);

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
  }

  function handleDeleteComment() {
    deleteComment(commentId);
  }

  function handleMouseOver() {
    setMouseHover(true);
  }

  function handleMouseOut() {
    setMouseHover(false);
  }

  return (
    <li className="comment" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
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
              {relativeDate(timePosted)}
            </time>
          </div>
          <div className="comment__meta-menu">
            <Menu>
              <MenuButton className="comment__menu-dropdown">
                <Icon size={18} icon={ICONS.MORE_VERTICAL} />
              </MenuButton>
              <MenuList className="comment__menu-list">
                {commentIsMine && (<MenuItem className="comment__menu-option">{__('Edit')}</MenuItem>)}
                {commentIsMine && (<MenuItem className="comment__menu-option">{__('Delete')}</MenuItem>)}
                {!commentIsMine && (<MenuItem className="comment__menu-option">{__('Report')}</MenuItem>)}
                {claimIsMine && (<MenuItem className="comment__menu-option">{__('Hide')}</MenuItem>)}
              </MenuList>
            </Menu>
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
      </div>
    </li>
  );
}

export default Comment;
