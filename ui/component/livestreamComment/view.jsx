// @flow
import 'scss/component/_livestream-comment.scss';

import { getStickerUrl } from 'util/comments';
import { Menu, MenuButton } from '@reach/menu-button';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CommentBadge from 'component/common/comment-badge';
import CommentMenuList from 'component/commentMenuList';
import CreditAmount from 'component/common/credit-amount';
import DateTime from 'component/dateTime';
import Empty from 'component/common/empty';
import Icon from 'component/common/icon';
import MarkdownPreview from 'component/common/markdown-preview';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';

type Props = {
  comment: Comment,
  forceUpdate?: any,
  uri: string,
  // --- redux:
  claim: StreamClaim,
  myChannelIds: ?Array<string>,
  stakedLevel: number,
  handleDismissPin?: () => void,
};

export default function LivestreamComment(props: Props) {
  const { comment, forceUpdate, uri, claim, myChannelIds, stakedLevel, handleDismissPin } = props;

  const {
    channel_url: authorUri,
    comment_id: commentId,
    comment: message,
    is_fiat: isFiat,
    is_global_mod: isGlobalMod,
    is_moderator: isModerator,
    is_pinned: isPinned,
    removed,
    support_amount: supportAmount,
    timestamp,
  } = comment;

  const [hasUserMention, setUserMention] = React.useState(false);

  const isStreamer = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const { claimName } = parseURI(authorUri || '');
  const stickerUrlFromMessage = getStickerUrl(message);
  const isSticker = Boolean(stickerUrlFromMessage);
  const timePosted = timestamp * 1000;
  const commentIsMine = comment.channel_id && isMyComment(comment.channel_id);

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    return myChannelIds ? myChannelIds.includes(channelId) : false;
  }

  return (
    <li
      className={classnames('livestream__comment', {
        'livestream__comment--superchat': supportAmount > 0,
        'livestream__comment--sticker': isSticker,
        'livestream__comment--mentioned': hasUserMention,
      })}
    >
      {supportAmount > 0 && (
        <div className="livestreamComment__superchatBanner">
          <div className="livestreamComment__superchatBanner--corner" />
          <CreditAmount isFiat={isFiat} amount={supportAmount} superChat />
        </div>
      )}

      <div className="livestreamComment__body">
        {supportAmount > 0 && <ChannelThumbnail uri={authorUri} xsmall />}

        <div className="livestreamComment__info">
          {isGlobalMod && <CommentBadge label={__('Admin')} icon={ICONS.BADGE_MOD} size={16} />}
          {isModerator && <CommentBadge label={__('Moderator')} icon={ICONS.BADGE_MOD} size={16} />}
          {isStreamer && <CommentBadge label={__('Streamer')} icon={ICONS.BADGE_STREAMER} size={16} />}

          <Button
            className={classnames('button--uri-indicator comment__author', { 'comment__author--creator': isStreamer })}
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

          {/* Use key to force timestamp update */}
          <DateTime date={timePosted} timeAgo key={forceUpdate} genericSeconds />

          {isSticker ? (
            <div className="sticker__comment">
              <OptimizedImage src={stickerUrlFromMessage} waitLoad loading="lazy" />
            </div>
          ) : (
            <div className="livestreamComment__text">
              {removed ? (
                <Empty text={__('[Removed]')} />
              ) : (
                <MarkdownPreview
                  content={message}
                  promptLinks
                  stakedLevel={stakedLevel}
                  disableTimestamps
                  setUserMention={setUserMention}
                />
              )}
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
            isTopLevel
            disableEdit
            disableRemove={comment.removed}
            isLiveComment
            handleDismissPin={handleDismissPin}
          />
        </Menu>
      </div>
    </li>
  );
}
