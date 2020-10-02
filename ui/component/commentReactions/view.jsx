// @flow
import * as ICONS from 'constants/icons';
import * as REACTION_TYPES from 'constants/reactions';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import usePersistedState from 'effects/use-persisted-state';

type Props = {
  myReacts: Array<string>,
  othersReacts: any,
  react: (string, string) => void,
  commentId: string,
  pendingCommentReacts: Array<string>,
};

export default function CommentReactions(props: Props) {
  const { myReacts, othersReacts, commentId, react } = props;
  const [activeChannel] = usePersistedState('comment-channel');

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

  return (
    <>
      <Button
        requiresAuth={IS_WEB}
        title={__('Upvote')}
        icon={ICONS.UPVOTE}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.LIKE),
        })}
        disabled={!activeChannel}
        onClick={() => react(commentId, REACTION_TYPES.LIKE)}
        label={getCountForReact(REACTION_TYPES.LIKE)}
      />
      <Button
        requiresAuth={IS_WEB}
        title={__('Downvote')}
        icon={ICONS.DOWNVOTE}
        className={classnames('comment__action', {
          'comment__action--active': myReacts && myReacts.includes(REACTION_TYPES.DISLIKE),
        })}
        disabled={!activeChannel}
        onClick={() => react(commentId, REACTION_TYPES.DISLIKE)}
        label={getCountForReact(REACTION_TYPES.DISLIKE)}
      />
    </>
  );
}
