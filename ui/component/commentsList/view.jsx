// @flow
import React, { useEffect } from 'react';
import Comment from 'component/comment';

type Props = {
  comments: Array<any>,
  fetchComments: string => void,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
};

function CommentList(props: Props) {
  const { fetchComments, uri, comments, claimIsMine, myChannels } = props;

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

  useEffect(() => {
    fetchComments(uri);
  }, [fetchComments, uri]);

  function sortByParent(arrayOfComments) {
    let parentComments = arrayOfComments.filter(comment => comment.parent_id === undefined);
    let childComments = arrayOfComments.filter(comment => comment.parent_id !== undefined);
    let sortedArray = [];

    parentComments.forEach(parentComment => {
      sortedArray.push(parentComment);

      childComments
        .filter(childComment => childComment.parent_id === parentComment.comment_id)
        .forEach(childComment => {
          sortedArray.push(childComment);
        });
    });

    return sortedArray;
  }

  return (
    <ul className="comments">
      {comments &&
        sortByParent(comments).map(comment => {
          return (
            <Comment
              uri={uri}
              authorUri={comment.channel_url}
              author={comment.channel_name}
              claimId={comment.claim_id}
              commentId={comment.comment_id}
              key={comment.channel_id + comment.comment_id}
              message={comment.comment}
              parentId={comment.parent_id || null}
              timePosted={comment.timestamp * 1000}
              claimIsMine={claimIsMine}
              commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
            />
          );
        })}
    </ul>
  );
}

export default CommentList;
