// @flow
import * as ICONS from 'constants/icons';
import * as REACTION_TYPES from 'constants/reactions';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';

type Props = {
  myReaction: ?string,
};

export default function CommentReactions(props: Props) {
  const { myReaction } = props;

  return (
    <>
      <Button
        title={__('Upvote')}
        icon={ICONS.UPVOTE}
        className={classnames('comment__action', {
          'comment__action--active': myReaction === REACTION_TYPES.LIKE,
        })}
      />
      <Button
        title={__('Downvote')}
        icon={ICONS.DOWNVOTE}
        className={classnames('comment__action', {
          'comment__action--active': myReaction === REACTION_TYPES.DISLIKE,
        })}
      />
    </>
  );
}
