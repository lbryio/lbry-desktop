// @flow
import React from 'react';
import Comment from 'component/comment';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import CommentCreate from 'component/commentCreate';

type Props = {
  comments: Array<any>,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  linkedComment?: Comment,
  parentId: string,
  commentingEnabled: boolean,
};

function CommentsReplies(props: Props) {
  const { uri, comments, claimIsMine, myChannels, linkedComment, parentId, commentingEnabled } = props;
  const [isReplying, setReplying] = React.useState(false);
  const [isExpanded, setExpanded] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(9);
  const sortedComments = comments ? [...comments].reverse() : [];
  const numberOfComments = comments ? comments.length : 0;

  const showMore = () => {
    if (start > 0) {
      setStart(0);
    } else {
      setEnd(numberOfComments);
    }
  };

  const linkedCommentId = linkedComment ? linkedComment.comment_id : '';

  const commentsIndexOfLInked = comments && sortedComments.findIndex(e => e.comment_id === linkedCommentId);

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  const isMyComment = (channelId: string) => {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  };

  const handleCommentDone = () => {
    if (!isExpanded) {
      setExpanded(true);
      setStart(numberOfComments || 0);
    }
    setEnd(numberOfComments + 1);
    setReplying(false);
  };

  React.useEffect(() => {
    if (
      setStart &&
      setEnd &&
      setExpanded &&
      linkedCommentId &&
      Number.isInteger(commentsIndexOfLInked) &&
      commentsIndexOfLInked > -1
    ) {
      setStart(commentsIndexOfLInked);
      setEnd(commentsIndexOfLInked + 1);
      setExpanded(true);
    }
  }, [setStart, setEnd, setExpanded, linkedCommentId, commentsIndexOfLInked]);

  const displayedComments = sortedComments.slice(start, end);

  return (
    <li className={'comment__replies-container'}>
      <div className="comment__actions">
        <Button
          button="link"
          requiresAuth={IS_WEB}
          label={commentingEnabled ? __('Reply') : __('Sign in to reply')}
          className="comment__action  button--uri-indicator"
          onClick={() => setReplying(!isReplying)}
          icon={ICONS.REPLY}
        />
        {!isExpanded && Boolean(numberOfComments) && (
          <Button
            button={'link'}
            className={'button--uri-indicator'}
            label={__('Show %number% Replies', { number: numberOfComments })}
            onClick={() => setExpanded(true)}
            icon={ICONS.DOWN}
          />
        )}
        {isExpanded && (
          <Button
            button={'link'}
            label={'Hide Replies'}
            onClick={() => setExpanded(false)}
            className={'button--uri-indicator'}
          />
        )}
      </div>
      {comments && displayedComments && isExpanded && (
        <ul className="comments">
          {displayedComments.map(comment => {
            return (
              <Comment
                uri={uri}
                authorUri={comment.channel_url}
                author={comment.channel_name}
                claimId={comment.claim_id}
                commentId={comment.comment_id}
                key={comment.comment_id}
                message={comment.comment}
                parentId={comment.parent_id || null}
                timePosted={comment.timestamp * 1000}
                claimIsMine={claimIsMine}
                commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                linkedComment={linkedComment}
              />
            );
          })}
        </ul>
      )}
      {isExpanded && comments && (end < numberOfComments || start > 0) && (
        <div className="comment__actions">
          <Button
            button={'link'}
            label={__('Show more', { number: numberOfComments - end })}
            onClick={showMore}
            className={'button--uri-indicator'}
          />
        </div>
      )}

      {isReplying ? (
        <CommentCreate
          key={parentId}
          uri={uri}
          parentId={parentId}
          onDoneReplying={() => handleCommentDone()}
          onCancelReplying={() => setReplying(false)}
        />
      ) : (
        ''
      )}
    </li>
  );
}

export default CommentsReplies;
