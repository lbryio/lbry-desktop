// @flow
import React, { useEffect } from 'react';
import Comment from 'component/comment';

type Props = {
  comments: Array<any>,
  fetchComments: string => void,
  uri: string,
};

function CommentList(props: Props) {
  const { fetchComments, uri, comments } = props;

  useEffect(() => {
    fetchComments(uri);
  }, [fetchComments, uri]);

  return (
    <ul className="comments">
      {comments &&
        comments.map(comment => {
          return (
            <Comment
              authorUri={comment.channel_url}
              author={comment.channel_name}
              claimId={comment.channel_id}
              commentId={comment.comment_id}
              key={comment.channel_id + comment.comment_id}
              message={comment.comment}
              parentId={comment.parent_id || null}
              timePosted={comment.timestamp * 1000}
            />
          );
        })}
    </ul>
  );
}

export default CommentList;
