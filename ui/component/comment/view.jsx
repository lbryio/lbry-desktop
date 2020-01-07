// @flow
import React, { useEffect } from 'react';
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
  author: string,
  authorUri: string,
  message: string,
  timePosted: number,
  commentIsMine: boolean,
  channel: ?Claim,
  claimIsMine: boolean,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
  channelIsBlocked: boolean,
  hidden: boolean,
  claimId: string,
  commentId: string,
};

const LENGTH_TO_COLLAPSE = 300;

function Comment(props: Props) {
  const {
    message,
    timePosted,
    commentIsMine,
    channel,
    claimIsMine,
    isResolvingUri,
    author,
    authorUri,
    pending,
    resolveUri,
    channelIsBlocked,

  } = props;
  // to debounce subsequent requests
  const shouldFetch =
    channel === undefined || (channel !== null && channel.value_type === 'channel' && isEmpty(channel.meta) && !pending);

  useEffect(() => {
    // If author was extracted from the URI, then it must be valid.
    if (authorUri && author && !isResolvingUri && shouldFetch) {
      resolveUri(authorUri);
    }
  }, [isResolvingUri, shouldFetch, author, authorUri, resolveUri]);

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
          {message.length >= LENGTH_TO_COLLAPSE ? (
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
