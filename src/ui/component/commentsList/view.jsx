import React, { useEffect, useState } from 'react';
import { Lbry, parseURI } from 'lbry-redux';

class Comment extends React.PureComponent<Props> {
  render() {
    return (
      <span class="button button--no-style navigation__link card__message">
        <div class="media__info-text">
          <div class="media__subtitle__channel">{this.props.message}</div>
          <div class="card__actions--between">{this.props.author}</div>
        </div>
      </span>
    );
  }
}

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
    Lbry.comment_list({ claim_id: claimId })
      .then(result => setComments(result))
      .catch(error => console.error(error));
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
    <ul class="navigation__links">
      {comments.comments.map(comment => {
        return (
          <li>
            <Comment
              commentId={comment.comment_id}
              claimId={comment.claim_id}
              author={comment.author}
              message={comment.message}
              timePosted={comment.time_posted}
            />
          </li>
        );
      })}
    </ul>
  );
}
