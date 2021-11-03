// @flow
import 'scss/component/_livestream-comment.scss';
import { Menu, MenuButton } from '@reach/menu-button';
import { parseSticker } from 'util/comments';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CommentMenuList from 'component/commentMenuList';
import CreditAmount from 'component/common/credit-amount';
import Icon from 'component/common/icon';
import MarkdownPreview from 'component/common/markdown-preview';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';
import Tooltip from 'component/common/tooltip';

type Props = {
  claim: StreamClaim,
  comment: Comment,
  myChannels: ?Array<ChannelClaim>,
  stakedLevel: number,
  uri: string,
};

function LivestreamComment(props: Props) {
  const { claim, comment, myChannels, stakedLevel, uri } = props;

  const {
    channel_url: authorUri,
    channel_id: authorId,
    comment_id: commentId,
    comment: message,
    is_fiat: isFiat,
    is_global_mod: isGlobalMod,
    is_moderator: isModerator,
    is_pinned: isPinned,
    support_amount: supportAmount,
  } = comment;
  const commentIsMine = authorId && myChannels && myChannels.some(({ claim_id }) => claim_id === authorId);

  const commentByContentOwner = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const stickerFromMessage = parseSticker(message);
  let claimName;
  try {
    authorUri && ({ claimName } = parseURI(authorUri));
  } catch (e) {}

  const commentBadge = (label: string, icon: string, className?: string) => (
    <Tooltip label={label}>
      <span className={classnames('comment__badge', { className })}>
        <Icon icon={icon} size={16} />
      </span>
    </Tooltip>
  );

  return (
    <li
      className={classnames('livestreamComment', {
        'livestreamComment--superchat': supportAmount > 0,
        'livestreamComment--sticker': Boolean(stickerFromMessage),
      })}
    >
      {supportAmount > 0 && (
        <div className="superChat livestreamComment__superchatBanner">
          <div className="livestreamComment__superchatBanner-corner" />
          <CreditAmount isFiat={isFiat} amount={supportAmount} superChat className="livestreamSuperchat__amount" />
        </div>
      )}

      <div className="livestreamComment__body">
        {(supportAmount > 0 || Boolean(stickerFromMessage)) && <ChannelThumbnail uri={authorUri} xsmall />}
        <div
          className={classnames('livestreamComment__info', {
            'livestreamComment__info--sticker': Boolean(stickerFromMessage),
          })}
        >
          {isGlobalMod && commentBadge(__('Admin'), ICONS.BADGE_MOD, 'comment__badge--globalMod')}
          {isModerator && commentBadge(__('Moderator'), ICONS.BADGE_MOD, 'comment__badge--mod')}
          {commentByContentOwner && commentBadge(__('Streamer'), ICONS.BADGE_STREAMER)}

          <Button
            className={classnames('button--uri-indicator comment__author', {
              'comment__author--creator': commentByContentOwner,
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

          {stickerFromMessage ? (
            <div className="comment__message--sticker">
              <OptimizedImage src={stickerFromMessage.url} waitLoad />
            </div>
          ) : (
            <div className="livestreamComment__text">
              <MarkdownPreview content={message} promptLinks stakedLevel={stakedLevel} disableTimestamps />
            </div>
          )}
        </div>
      </div>

      <div className="livestreamComment__menu">
        <Menu>
          <MenuButton className="menu__button">
            <Icon size={18} icon={ICONS.MORE_VERTICAL} />
          </MenuButton>
          <CommentMenuList
            uri={uri}
            commentId={commentId}
            authorUri={authorUri}
            commentIsMine={commentIsMine}
            isPinned={isPinned}
            disableRemove={supportAmount > 0}
            isTopLevel
            disableEdit
            isLiveComment
          />
        </Menu>
      </div>
    </li>
  );
}

export default LivestreamComment;
