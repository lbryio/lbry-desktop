import React, { useEffect, useState } from 'react';
import { Lbry, parseURI } from 'lbry-redux';

export default function CommentsList(props) {
  const { uri } = props;
  const { claimId } = parseURI(uri);

  // We have local "state" which is a list of comments
  // And we have "setComments" which is a way to update the local state with new comments
  // useState sets that up and says the initial value for "comments" is 'undefined'
  const [comments, setComments] = useState(undefined);

  // useEffect is saying, when the properties that are passed in to this function change,
  // re-run this function, or re-run this "effect" that will update the local state
  useEffect(() => {
    console.log('claimID changed: ', claimId);
    // Lbry.commentsList(claimID)
    //   .then(comments => setComments(comments))
    //   .catch(error => console.error(error))
  }, [claimId]);

  // If there are no comments set yet, just return null
  if (!comments) {
    return null;
  }

  // If we have comments, we want to return a piece of UI
  // The same way we would return an array, we can return an "array" of <li> elements with the comment data inside
  return (
    <ul>
      {comments.map(comment => {
        <li>{comment.value}</li>;
      })}
    </ul>
  );
}
