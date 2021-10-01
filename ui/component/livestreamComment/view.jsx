// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { parseURI } from 'lbry-redux';
import MarkdownPreview from 'component/common/markdown-preview';
import Tooltip from 'component/common/tooltip';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuButton } from '@reach/menu-button';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import CommentMenuList from 'component/commentMenuList';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  uri: string,
  claim: StreamClaim,
  authorUri: string,
  commentId: string,
  message: string,
  commentIsMine: boolean,
  stakedLevel: number,
  supportAmount: number,
  isModerator: boolean,
  isGlobalMod: boolean,
  isFiat: boolean,
  isPinned: boolean,
};

function LivestreamComment(props: Props) {
  const {
    claim,
    uri,
    authorUri,
    message,
    commentIsMine,
    commentId,
    stakedLevel,
    supportAmount,
    isModerator,
    isGlobalMod,
    isFiat,
    isPinned,
  } = props;

  const commentByOwnerOfContent = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const { claimName } = parseURI(authorUri);

  return (
    <li
      className={classnames('livestream-comment', {
        'livestream-comment--superchat': supportAmount > 0,
      })}
    >
      {supportAmount > 0 && (
        <div className="super-chat livestream-superchat__banner">
          <div className="livestream-superchat__banner-corner" />
          <CreditAmount isFiat={isFiat} amount={supportAmount} superChat className="livestream-superchat__amount" />
        </div>
      )}

      <div className="livestream-comment__body">
        {supportAmount > 0 && <ChannelThumbnail uri={authorUri} xsmall />}
        <div className="livestream-comment__info">
          {isGlobalMod && (
            <Tooltip label={__('Admin')}>
              <span className="comment__badge comment__badge--global-mod">
                <Icon icon={ICONS.BADGE_MOD} size={16} />
              </span>
            </Tooltip>
          )}

          {isModerator && (
            <Tooltip label={__('Moderator')}>
              <span className="comment__badge comment__badge--mod">
                <Icon icon={ICONS.BADGE_MOD} size={16} />
              </span>
            </Tooltip>
          )}

          {commentByOwnerOfContent && (
            <Tooltip label={__('Streamer')}>
              <span className="comment__badge">
                <Icon icon={ICONS.BADGE_STREAMER} size={16} />
              </span>
            </Tooltip>
          )}

          <Button
            className={classnames('button--uri-indicator comment__author', {
              'comment__author--creator': commentByOwnerOfContent,
            })}
            target="_blank"
            navigate={authorUri}
          >
            {claimName}
          </Button>

          {isPinned && (
            <span className="comment__pin">
              <Icon icon={ICONS.PIN} size={14} />
              {__('Pinned')}
            </span>
          )}

          <div className="livestream-comment__text">
            <MarkdownPreview content={message} promptLinks stakedLevel={stakedLevel} />
          </div>
        </div>
      </div>

      <div className="livestream-comment__menu">
        <Menu>
          <MenuButton className="menu__button">
            <Icon size={18} icon={ICONS.MORE_VERTICAL} />
          </MenuButton>
          <CommentMenuList
            uri={uri}
            commentId={commentId}
            authorUri={authorUri}
            commentIsMine={commentIsMine}
            disableEdit
            isTopLevel
            isPinned={isPinned}
            disableRemove={supportAmount > 0}
          />
        </Menu>
      </div>
    </li>
  );
}

export default LivestreamComment;
