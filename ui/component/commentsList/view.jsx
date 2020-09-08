// @flow
import React, { useEffect } from 'react';
import Comment from 'component/comment';
import Spinner from 'component/spinner';
import Button from 'component/button';
import Card from 'component/common/card';
import CommentCreate from 'component/commentCreate';
import CommentsReplies from 'component/commentsReplies';

type Props = {
  comments: Array<any>,
  fetchComments: string => void,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  isFetchingComments: boolean,
  linkedComment: any,
};

function CommentList(props: Props) {
  const { fetchComments, uri, comments, claimIsMine, myChannels, isFetchingComments, linkedComment } = props;

  const linkedCommentId = linkedComment && linkedComment.comment_id;
  const [start] = React.useState(0);
  const [end, setEnd] = React.useState(9);
  const totalComments = comments && comments.length;
  const hasNoComments = totalComments === 0;

  const moreBelow = totalComments - end > 0;
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

  const handleMoreBelow = () => {
    if (moreBelow) {
      setEnd(end + 10);
    }
  };

  const commentRef = React.useRef();

  useEffect(() => {
    fetchComments(uri);
  }, [fetchComments, uri]);

  useEffect(() => {
    if (linkedCommentId && commentRef && commentRef.current) {
      commentRef.current.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -100);
    }
  }, [linkedCommentId]);

  function prepareComments(arrayOfComments, linkedComment) {
    let orderedComments = [];

    if (linkedComment) {
      if (!linkedComment.parent_id) {
        orderedComments = arrayOfComments.filter(c => c.comment_id !== linkedComment.comment_id);
        orderedComments.unshift(linkedComment);
      } else {
        const parentComment = arrayOfComments.find(c => c.comment_id === linkedComment.parent_id);
        orderedComments = arrayOfComments.filter(c => c.comment_id !== linkedComment.parent_id);
        orderedComments.unshift(parentComment);
      }
    } else {
      orderedComments = arrayOfComments;
    }
    return orderedComments;
  }

  const displayedComments = prepareComments(comments, linkedComment).slice(start, end);

  return (
    <Card
      title={
        totalComments > 0
          ? totalComments === 1
            ? __('1 comment')
            : __('%total_comments% comments', { total_comments: totalComments })
          : __('Leave a comment')
      }
      actions={
        <>
          <CommentCreate uri={uri} />
          {!isFetchingComments && hasNoComments && <div className="main--empty">{__('Be the first to comment!')}</div>}
          <ul className="comments" ref={commentRef}>
            {isFetchingComments && (
              <div className="main--empty">
                <Spinner />
              </div>
            )}
            {!isFetchingComments &&
              comments &&
              displayedComments &&
              displayedComments.map(comment => {
                return (
                  <>
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
                    <CommentsReplies
                      uri={uri}
                      parentId={comment.comment_id}
                      linkedComment={linkedComment}
                      key={comment.comment_id + 'replies'}
                    />
                  </>
                );
              })}
          </ul>
          {moreBelow && (
            <div className="comment__actions">
              <Button button="link" className="comment__more-below" onClick={handleMoreBelow} label={__('Show More')} />
            </div>
          )}
        </>
      }
    />
  );
}

export default CommentList;
