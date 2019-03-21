import React, { useEffect, useState } from 'react';
import { Lbry, parseURI } from 'lbry-redux';

export default function CommentsList(props) {
  const { uri } = props;
  const { claimId } = parseURI(uri);

  const [comments, setComments] = useState(undefined);
  useEffect(() => {
    console.log('claimID changed: ', claimId);
    // Lbry.commentsList(claimID)
    //   .then(comments => setComments(comments))
    //   .catch(error => console.error(error))
  }, [claimId]);

  if (!comments) {
    return null;
  }

  return (
    <ul>
      {comments.map(comment => {
        <li>{comment.value}</li>;
      })}
    </ul>
  );
}
