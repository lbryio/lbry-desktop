// @flow
import 'scss/component/_livestream-comment.scss';

import { getStickerUrl } from 'util/comments';
import { Menu, MenuButton } from '@reach/menu-button';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
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
import MembershipBadge from 'component/membershipBadge';
import usePersistedState from 'effects/use-persisted-state';
import { Lbryio } from 'lbryinc';

type Props = {
  comment: Comment,
  forceUpdate?: any,
  uri: string,
  isMobile?: boolean,
  isCompact?: boolean,
  restoreScrollPos?: () => void,
  handleCommentClick: (any) => void,
  handleDismissPin?: () => void,
  // --- redux:
  claim: StreamClaim,
  stakedLevel: number,
  claimsByUri: { [string]: any },
  odyseeMembership: ?string,
  creatorMembership: ?string,
  activeChannelClaim?: any,
  authorTitle: string,
  channelAge?: any,
};

export const ChatCommentContext = React.createContext<any>();

export default function ChatComment(props: Props) {
  const {
    comment,
    forceUpdate,
    uri,
    claim,
    // myChannelIds,
    stakedLevel,
    isMobile,
    handleDismissPin,
    restoreScrollPos,
    handleCommentClick,
    odyseeMembership,
    creatorMembership,
    authorTitle,
    activeChannelClaim,
    channelAge,
    isCompact,
  } = props;

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

  const isSprout = channelAge && Math.round((new Date() - channelAge) / (1000 * 60 * 60 * 24)) < 7;

  const [exchangeRate, setExchangeRate] = React.useState(0);
  React.useEffect(() => {
    if (!exchangeRate) Lbryio.getExchangeRates().then(({ LBC_USD }) => setExchangeRate(LBC_USD));
  }, [exchangeRate]);

  const basedAmount = isFiat && exchangeRate ? supportAmount : supportAmount * 10 * exchangeRate;
  const [hasUserMention, setUserMention] = React.useState(false);

  const isStreamer = claim && claim.signing_channel && claim.signing_channel.permanent_url === authorUri;
  const { claimName: authorName } = parseURI(authorUri || '');
  const claimName = authorTitle || authorName;
  const stickerUrlFromMessage = getStickerUrl(message);
  const isSticker = Boolean(stickerUrlFromMessage);
  const timePosted = timestamp * 1000;
  const commentIsMine = comment.channel_id && isMyComment(comment.channel_id);
  const [showTimestamps] = usePersistedState('live-timestamps', false);

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    // return myChannelIds ? myChannelIds.includes(channelId) : false;
    return activeChannelClaim && activeChannelClaim.claim_id === channelId;
  }

  // For every new <LivestreamComment /> component that is rendered on mobile view,
  // keep the scroll at the bottom (newest)
  React.useEffect(() => {
    if (isMobile && restoreScrollPos) {
      restoreScrollPos();
    }
  }, [isMobile, restoreScrollPos]);

  React.useEffect(() => {
    if (hasUserMention) setUserMention(false);
  }, [activeChannelClaim]);

  return (
    <li
      className={classnames('livestream__comment', {
        'livestream__comment--hyperchat': basedAmount,
        'hyperchat-level1': basedAmount >= 5,
        'hyperchat-level2': basedAmount >= 10,
        'hyperchat-level3': basedAmount >= 50,
        'hyperchat-level4': basedAmount >= 100,
        'hyperchat-level5': basedAmount >= 500,
        'livestream__comment--sticker': isSticker,
        'livestream__comment--mentioned': hasUserMention,
        'livestream__comment--mobile': isMobile,
        'livestream__comment--minimal': isCompact,
      })}
    >
      {supportAmount > 0 && (
        <div className="livestreamComment__hyperchatBanner">
          <CreditAmount isFiat={isFiat} amount={supportAmount} hyperChat />
        </div>
      )}

      <div className="livestreamComment__body">
        {false && supportAmount > 0 && <ChannelThumbnail uri={authorUri} xsmall />}
        {!isCompact || isPinned ? (
          <>
            <ChannelThumbnail uri={authorUri} xsmall />

            <div className="livestreamComment__info">
              <div className="livestreamComment__meta-information">
                <Menu>
                  <MenuButton
                    className={classnames('button--uri-indicator comment__author', {
                      'comment__author--creator': isStreamer,
                    })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {claimName}
                  </MenuButton>

                  <CommentMenuList
                    uri={uri}
                    commentId={commentId}
                    authorUri={authorUri}
                    authorName={comment && comment.channel_name}
                    commentIsMine={commentIsMine}
                    isPinned={isPinned}
                    isTopLevel
                    disableEdit
                    disableRemove={comment.removed}
                    isLiveComment
                    handleDismissPin={handleDismissPin}
                    setQuickReply={handleCommentClick}
                  />
                </Menu>

                {isGlobalMod && <CommentBadge label={__('Admin')} icon={ICONS.BADGE_ADMIN} size={16} />}
                {isModerator && <CommentBadge label={__('Moderator')} icon={ICONS.BADGE_MOD} size={16} />}
                {isStreamer && <CommentBadge label={__('Streamer')} icon={ICONS.BADGE_STREAMER} size={16} />}
                {!isStreamer && !isModerator && !isGlobalMod && !odyseeMembership && isSprout && (
                  <CommentBadge label={__('Sprout')} icon={ICONS.BADGE_SPROUT} size={16} />
                )}
                {odyseeMembership && <MembershipBadge membershipName={odyseeMembership} linkPage />}
                {creatorMembership && <MembershipBadge membershipName={creatorMembership} linkPage uri={uri} />}

                {isPinned && (
                  <span className="comment__pin">
                    <Icon icon={ICONS.PIN} size={14} />
                    {__('Pinned')}
                  </span>
                )}

                {/* Use key to force timestamp update */}
                <DateTime date={timePosted} timeAgo key={forceUpdate} genericSeconds />
              </div>

              {isSticker ? (
                <div className="sticker__comment">
                  <OptimizedImage src={stickerUrlFromMessage} waitLoad loading="lazy" />
                </div>
              ) : (
                <div className="livestreamComment__text">
                  {removed ? (
                    <Empty text={__('[Removed]')} />
                  ) : (
                    <ChatCommentContext.Provider value={{ isLiveComment: true }}>
                      <MarkdownPreview
                        content={message}
                        promptLinks
                        stakedLevel={stakedLevel}
                        disableTimestamps
                        setUserMention={setUserMention}
                        hasMembership={Boolean(odyseeMembership)}
                        isComment
                      />
                    </ChatCommentContext.Provider>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="livestreamComment--minimal">
            {showTimestamps && <DateTime date={timePosted} key={forceUpdate} />}
            {(isStreamer || isModerator || isGlobalMod || odyseeMembership) && (
              <ChannelThumbnail uri={authorUri} xxxsmall />
            )}
            {isGlobalMod && <CommentBadge label={__('Admin')} icon={ICONS.BADGE_ADMIN} size={16} />}
            {isModerator && <CommentBadge label={__('Moderator')} icon={ICONS.BADGE_MOD} size={16} />}
            {isStreamer && <CommentBadge label={__('Streamer')} icon={ICONS.BADGE_STREAMER} size={16} />}
            {!isStreamer && !isModerator && !isGlobalMod && isSprout && (
              <CommentBadge label={__('Sprout')} icon={ICONS.BADGE_SPROUT} size={16} />
            )}
            {odyseeMembership && <MembershipBadge membershipName={odyseeMembership} linkPage />}
            {creatorMembership && <MembershipBadge membershipName={creatorMembership} linkPage uri={uri} />}
            <Menu>
              <MenuButton
                className={classnames('button--uri-indicator comment__author', {
                  'comment__author--creator': isStreamer,
                })}
                onClick={(e) => e.stopPropagation()}
              >
                {claimName}
              </MenuButton>

              <CommentMenuList
                uri={uri}
                commentId={commentId}
                authorUri={authorUri}
                authorName={comment && comment.channel_name}
                commentIsMine={commentIsMine}
                isPinned={isPinned}
                isTopLevel
                disableEdit
                disableRemove={comment.removed}
                isLiveComment
                handleDismissPin={handleDismissPin}
                setQuickReply={handleCommentClick}
              />
            </Menu>
            <p className="colon">:</p>
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
                    hasMembership={Boolean(odyseeMembership)}
                    isComment
                    isMinimal={isCompact}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="livestreamComment__menu">
        <Menu>
          <MenuButton className="menu__button" onClick={(e) => e.stopPropagation()}>
            <Icon size={18} icon={ICONS.MORE_VERTICAL} />
          </MenuButton>

          <CommentMenuList
            uri={uri}
            commentId={commentId}
            authorUri={authorUri}
            authorName={comment && comment.channel_name}
            commentIsMine={commentIsMine}
            isPinned={isPinned}
            isTopLevel
            disableEdit
            disableRemove={comment.removed}
            isLiveComment
            handleDismissPin={handleDismissPin}
            setQuickReply={handleCommentClick}
          />
        </Menu>
      </div>
    </li>
  );
}
