// @flow
import { ENABLE_CREATOR_REACTIONS } from 'config';
import * as ICONS from 'constants/icons';
import * as REACTION_TYPES from 'constants/reactions';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';

type Props = {
  myReacts: Array<string>,
  othersReacts: any,
  react: (string, string) => void,
  commentId: string,
  pendingCommentReacts: Array<string>,
  claimIsMine: boolean,
  activeChannel: string,
  claim: ?ChannelClaim,
};

export default function CommentReactions(props: Props) {
  const { myReacts, othersReacts, commentId, react, claimIsMine, claim, activeChannel } = props;
  const canCreatorReact =
    claim &&
    claimIsMine &&
    (claim.value_type === 'channel'
      ? claim.name === activeChannel
      : claim.signing_channel && claim.signing_channel.name === activeChannel);
  const authorUri =
    claim && claim.value_type === 'channel'
      ? claim.canonical_url
      : claim && claim.signing_channel && claim.signing_channel.canonical_url;

  const getCountForReact = type => {
    let count = 0;
    if (othersReacts && othersReacts[type]) {
      count += othersReacts[type];
    }
    if (myReacts && myReacts.includes(type)) {
      count += 1;
    }
    return count;
  };

  const creatorLiked = getCountForReact(REACTION_TYPES.CREATOR_LIKE) > 0;

  return (
    <>
      <Button
        requiresAuth={IS_WEB}
        title={__('Upvote')}
        icon={myReacts.includes(REACTION_TYPES.LIKE) ? ICONS.FIRE_ACTIVE : ICONS.FIRE}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.LIKE),
        })}
        disabled={!activeChannel}
        onClick={() => react(commentId, REACTION_TYPES.LIKE)}
        label={<span className="comment__reaction-count">{getCountForReact(REACTION_TYPES.LIKE)}</span>}
      />
      <Button
        requiresAuth={IS_WEB}
        title={__('Downvote')}
        icon={myReacts.includes(REACTION_TYPES.DISLIKE) ? ICONS.SLIME_ACTIVE : ICONS.SLIME}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.DISLIKE),
        })}
        disabled={!activeChannel}
        onClick={() => react(commentId, REACTION_TYPES.DISLIKE)}
        label={<span className="comment__reaction-count">{getCountForReact(REACTION_TYPES.DISLIKE)}</span>}
      />

      {ENABLE_CREATOR_REACTIONS && (canCreatorReact || creatorLiked) && (
        <Button
          iconOnly
          disabled={!canCreatorReact || !claimIsMine}
          requiresAuth={IS_WEB}
          title={claimIsMine ? __('You loved this') : __('Creator loved this')}
          icon={creatorLiked ? ICONS.CREATOR_LIKE : ICONS.SUBSCRIBE}
          className={classnames('comment__action comment__action--creator-like')}
          onClick={() => react(commentId, REACTION_TYPES.CREATOR_LIKE)}
        >
          {creatorLiked && <ChannelThumbnail uri={authorUri} className="comment__creator-like" />}
        </Button>
      )}
    </>
  );
}
