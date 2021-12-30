// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { parseURI } from 'util/lbryURI';
import Empty from 'component/common/empty';
import MarkdownPreview from 'component/common/markdown-preview';
import Tooltip from 'component/common/tooltip';
import ChannelThumbnail from 'component/channelThumbnail';
import { Menu, MenuButton } from '@reach/menu-button';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import CommentMenuList from 'component/commentMenuList';
import Button from 'component/button';
import CreditAmount from 'component/common/credit-amount';
import OptimizedImage from 'component/optimizedImage';
import { parseSticker } from 'util/comments';

type Props = {
  comment: Comment,
  uri: string,
  // --- redux:
  claim: StreamClaim,
  stakedLevel: number,
  myChannelIds: ?Array<string>,
};

function LivestreamComment(props: Props) {
  const { comment, claim, uri, stakedLevel, myChannelIds } = props;
  const { channel_url: authorUri, comment: message, support_amount: supportAmount } = comment;

  const [hasUserMention, setUserMention] = React.useState(false);
  const commentIsMine = comment.channel_id && isMyComment(comment.channel_id);

  const commentByOwnerOfContent = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const { claimName } = parseURI(authorUri || '');
  const stickerFromMessage = parseSticker(message);

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    return myChannelIds ? myChannelIds.includes(channelId) : false;
  }

  return (
    <li
      className={classnames('livestream-comment', {
        'livestream-comment--superchat': supportAmount > 0,
        'livestream-comment--sticker': Boolean(stickerFromMessage),
        'livestream-comment--mentioned': hasUserMention,
      })}
    >
      {supportAmount > 0 && (
        <div className="super-chat livestream-superchat__banner">
          <div className="livestream-superchat__banner-corner" />
          <CreditAmount
            isFiat={comment.is_fiat}
            amount={supportAmount}
            superChat
            className="livestream-superchat__amount"
          />
        </div>
      )}

      <div className="livestream-comment__body">
        {supportAmount > 0 && <ChannelThumbnail uri={authorUri} xsmall />}
        <div
          className={classnames('livestream-comment__info', {
            'livestream-comment__info--sticker': Boolean(stickerFromMessage),
          })}
        >
          {comment.is_global_mod && (
            <Tooltip title={__('Admin')}>
              <span className="comment__badge comment__badge--global-mod">
                <Icon icon={ICONS.BADGE_MOD} size={16} />
              </span>
            </Tooltip>
          )}

          {comment.is_moderator && (
            <Tooltip title={__('Moderator')}>
              <span className="comment__badge comment__badge--mod">
                <Icon icon={ICONS.BADGE_MOD} size={16} />
              </span>
            </Tooltip>
          )}

          {commentByOwnerOfContent && (
            <Tooltip title={__('Streamer')}>
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

          {comment.is_pinned && (
            <span className="comment__pin">
              <Icon icon={ICONS.PIN} size={14} />
              {__('Pinned')}
            </span>
          )}

          {comment.removed ? (
            <div className="livestream-comment__text">
              <Empty text={__('[Removed]')} />
            </div>
          ) : stickerFromMessage ? (
            <div className="sticker__comment">
              <OptimizedImage src={stickerFromMessage.url} waitLoad loading="lazy" />
            </div>
          ) : (
            <div className="livestream-comment__text">
              <MarkdownPreview
                content={message}
                promptLinks
                stakedLevel={stakedLevel}
                disableTimestamps
                setUserMention={setUserMention}
              />
            </div>
          )}
        </div>
      </div>

      <div className="livestream-comment__menu">
        <Menu>
          <MenuButton className="menu__button">
            <Icon size={18} icon={ICONS.MORE_VERTICAL} />
          </MenuButton>
          <CommentMenuList
            uri={uri}
            commentId={comment.comment_id}
            authorUri={authorUri}
            commentIsMine={commentIsMine}
            isPinned={comment.is_pinned}
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
