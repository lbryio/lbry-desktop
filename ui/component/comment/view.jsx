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
import * as MODALS from 'constants/modal_types';
import { FormField, Form } from 'component/common/form';

type Props = {
  author: ?string, // LBRY Channel Name, e.g. @channel
  authorUri: string, // full LBRY Channel URI: lbry://@channel#123...
  commentId: string, // sha256 digest identifying the comment
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
  hideComment: (string) => void,
  deleteComment: (string) => void,
  openModal: (id: string, { deleteComment: () => void }) => void,
};

const LENGTH_TO_COLLAPSE = 300;

// todo: move all the editing comment stuff out
function Comment(props: Props) {
  const {
    author,
    authorUri,
    timePosted,
    message,
    pending,
    channel,
    isResolvingUri,
    resolveUri,
    channelIsBlocked,
    claimIsMine,
    commentIsMine,
    commentId,
    updateComment,
    openModal,
    deleteComment,
  } = props;

  const [isEditing, setEditing] = useState(false);
  const [editedMessage, setCommentValue] = useState(message);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [charCount, setCharCount] = useState(editedMessage.length);

  // to debounce subsequent requests
  const shouldFetch =
    channel === undefined || (channel !== null && channel.value_type === 'channel' && isEmpty(channel.meta) && !pending);

  useEffect(() => {
    // If author was extracted from the URI, then it must be valid.
    if (authorUri && author && !isResolvingUri && shouldFetch) {
      resolveUri(authorUri);
    }

    // set the charCount here
    setCharCount(editedMessage.length);
  }, [isResolvingUri, shouldFetch, author, authorUri, resolveUri, editedMessage]);

  // edit button calls this function
  function handleSetEditing() {
    setEditing(true);
  }

  // when the body is changed, form calls this function
  function handleEditMessage(event) {
    setCommentValue(event.target.value);
  }

  // when the user is done, this function is called
  function handleSubmit() {
    updateComment(commentId, editedMessage);
    setCurrentMessage(editedMessage);
    setEditing(false);
  }

  function handleDeleteComment() {
    openModal(MODALS.DELETE_COMMENT, { deleteComment: () => deleteComment(commentId) });
  }

  return (
    <li className="comment">
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
              <MenuButton>
                <Icon size={18} icon={ICONS.MORE_VERTICAL} />
              </MenuButton>
              <MenuList className="menu__list--header">
                {commentIsMine && (
                  <MenuItem className="comment__menu-option" onSelect={handleSetEditing}>
                    {__('Edit')}
                  </MenuItem>)
                }
                {commentIsMine && (
                  <MenuItem className="comment__menu-option" onSelect={handleDeleteComment}>{__('Delete')}</MenuItem>
                )}
                {!commentIsMine && (
                  <MenuItem className="comment__menu-option">{__('Report')}</MenuItem>
                )}
                {claimIsMine && (
                  <MenuItem className="comment__menu-option">{__('Hide')}</MenuItem>
                )}
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
                onChange={handleEditMessage}
              />
              <Button
                button="primary"
                type="submit"
                label={__('Done')}
                requiresAuth={IS_WEB}
                disabled={currentMessage === editedMessage}
                />
            </Form>
          ) : (
            editedMessage.length >= LENGTH_TO_COLLAPSE ? (
              <div className="comment__message">
                <Expandable>
                  <MarkdownPreview content={currentMessage} />
                </Expandable>
              </div>
            ) : (
              <div className="comment__message">
                <MarkdownPreview content={currentMessage} />
              </div>
            )

            )}</div>
      </div>
    </li>
  );
}

export default Comment;
