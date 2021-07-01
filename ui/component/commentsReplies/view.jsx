// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Comment from 'component/comment';
import Button from 'component/button';

type Props = {
  comments: Array<any>,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  linkedComment?: Comment,
  commentingEnabled: boolean,
  threadDepth: number,
};

function CommentsReplies(props: Props) {
  const { uri, comments, claimIsMine, myChannels, linkedComment, commentingEnabled, threadDepth } = props;
  const [isExpanded, setExpanded] = React.useState(true);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(9);
  const sortedComments = comments ? [...comments].reverse() : [];
  const numberOfComments = comments ? comments.length : 0;
  const linkedCommentId = linkedComment ? linkedComment.comment_id : '';
  const commentsIndexOfLInked = comments && sortedComments.findIndex((e) => e.comment_id === linkedCommentId);

  function showMore() {
    if (start > 0) {
      setStart(0);
    } else {
      setEnd(numberOfComments);
    }
  }

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  }

  function handleCommentDone() {
    if (!isExpanded) {
      setExpanded(true);
      setStart(numberOfComments || 0);
    }
    setEnd(numberOfComments + 1);
  }

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
    Boolean(numberOfComments) && (
      <div className="comment__replies-container">
        {Boolean(numberOfComments) && !isExpanded && (
          <div className="comment__actions--nested">
            <Button
              className="comment__action"
              label={__('Show Replies')}
              onClick={() => setExpanded(!isExpanded)}
              icon={isExpanded ? ICONS.UP : ICONS.DOWN}
            />
          </div>
        )}
        {comments && displayedComments && isExpanded && (
          <div>
            <div className="comment__replies">
              <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setExpanded(false)} />

              <ul className="comments--replies">
                {displayedComments.map((comment, index) => {
                  return (
                    <Comment
                      threadDepth={threadDepth}
                      uri={uri}
                      authorUri={comment.channel_url}
                      author={comment.channel_name}
                      claimId={comment.claim_id}
                      commentId={comment.comment_id}
                      key={comment.comment_id}
                      message={comment.comment}
                      timePosted={comment.timestamp * 1000}
                      claimIsMine={claimIsMine}
                      commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                      linkedComment={linkedComment}
                      commentingEnabled={commentingEnabled}
                      handleCommentDone={handleCommentDone}
                      supportAmount={comment.support_amount}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        {isExpanded && comments && (end < numberOfComments || start > 0) && (
          <div className="comment__actions">
            <Button button="link" label={__('Show more')} onClick={showMore} className="button--uri-indicator" />
          </div>
        )}
      </div>
    )
  );
}

export default CommentsReplies;
