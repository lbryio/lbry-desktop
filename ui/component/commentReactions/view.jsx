// @flow
import { ENABLE_CREATOR_REACTIONS, SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as REACTION_TYPES from 'constants/reactions';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import { useHistory } from 'react-router';
import { useIsMobile } from 'effects/use-screensize';

type Props = {
  myReacts: Array<string>,
  othersReacts: any,
  react: (string, string) => void,
  commentId: string,
  pendingCommentReacts: Array<string>,
  claimIsMine: boolean,
  activeChannelId: ?string,
  uri: string,
  claim: ?ChannelClaim,
  doToast: ({ message: string }) => void,
  hideCreatorLike: boolean,
  resolve: (string) => void,
};

export default function CommentReactions(props: Props) {
  const {
    myReacts,
    othersReacts,
    commentId,
    react,
    claimIsMine,
    uri,
    claim,
    activeChannelId,
    doToast,
    hideCreatorLike,
    resolve,
  } = props;
  const {
    push,
    location: { pathname },
  } = useHistory();

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!claim) {
      resolve(uri);
    }
  }, [claim, resolve, uri]);

  const canCreatorReact =
    claim &&
    claimIsMine &&
    (claim.value_type === 'channel'
      ? claim.claim_id === activeChannelId
      : claim.signing_channel && claim.signing_channel.claim_id === activeChannelId);
  const authorUri =
    claim && claim.value_type === 'channel'
      ? claim.canonical_url
      : claim && claim.signing_channel && claim.signing_channel.canonical_url;

  const getCountForReact = (type) => {
    let count = 0;
    if (othersReacts && othersReacts[type]) {
      count += othersReacts[type];
    }
    if (myReacts && myReacts.includes(type)) {
      count += 1;
    }
    return count;
  };
  const shouldHide = !canCreatorReact && hideCreatorLike;
  const creatorLiked = getCountForReact(REACTION_TYPES.CREATOR_LIKE) > 0;
  const likeIcon = SIMPLE_SITE
    ? myReacts && myReacts.includes(REACTION_TYPES.LIKE)
      ? ICONS.FIRE_ACTIVE
      : ICONS.FIRE
    : ICONS.UPVOTE;
  const dislikeIcon = SIMPLE_SITE
    ? myReacts && myReacts.includes(REACTION_TYPES.DISLIKE)
      ? ICONS.SLIME_ACTIVE
      : ICONS.SLIME
    : ICONS.DOWNVOTE;

  function handleCommentLike() {
    if (activeChannelId) {
      react(commentId, REACTION_TYPES.LIKE);
    } else {
      promptForChannel();
    }
  }

  function handleCommentDislike() {
    if (activeChannelId) {
      react(commentId, REACTION_TYPES.DISLIKE);
    } else {
      promptForChannel();
    }
  }

  function promptForChannel() {
    push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}&lc=${commentId}`);
    doToast({ message: __('A channel is required to throw fire and slime') });
  }

  return (
    <>
      <Button
        requiresAuth={IS_WEB}
        title={__('Upvote')}
        icon={likeIcon}
        iconSize={isMobile && 12}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.LIKE),
        })}
        onClick={handleCommentLike}
        label={<span className="comment__reaction-count">{getCountForReact(REACTION_TYPES.LIKE)}</span>}
      />
      <Button
        requiresAuth={IS_WEB}
        title={__('Downvote')}
        icon={dislikeIcon}
        iconSize={isMobile && 12}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.DISLIKE),
        })}
        onClick={handleCommentDislike}
        label={<span className="comment__reaction-count">{getCountForReact(REACTION_TYPES.DISLIKE)}</span>}
      />

      {!shouldHide && ENABLE_CREATOR_REACTIONS && (canCreatorReact || creatorLiked) && (
        <Button
          disabled={!canCreatorReact || !claimIsMine}
          requiresAuth={IS_WEB}
          title={claimIsMine ? __('You loved this') : __('Creator loved this')}
          icon={creatorLiked ? ICONS.CREATOR_LIKE : ICONS.SUBSCRIBE}
          className={classnames('comment__action comment__action--creator-like')}
          onClick={() => react(commentId, REACTION_TYPES.CREATOR_LIKE)}
        >
          {creatorLiked && (
            <ChannelThumbnail xsmall uri={authorUri} hideStakedIndicator className="comment__creator-like" allowGifs />
          )}
        </Button>
      )}
    </>
  );
}
