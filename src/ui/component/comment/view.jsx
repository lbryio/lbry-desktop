// @flow
import React from 'react';
import relativeDate from 'tiny-relative-date';

type Props = {
  author: string,
  message: string,
  timePosted: number,
};

function Comment(props: Props) {
  const { author, timePosted, message } = props;

  return (
    <li className="comment">
      <div className="comment__meta card__actions--between">
        <strong>{author || __('Anonymous')}</strong>

        <time dateTime={timePosted}>{relativeDate(timePosted)}</time>
      </div>

      <p>{message}</p>
      {/* The following is for adding threaded replies, upvoting and downvoting */}
      {/* <div className="comment__actions card__actions--between"> */}
      {/*  <button className={'button button--primary'}>Reply</button> */}

      {/*  <span className="comment__actions-wrap"> */}
      {/*    <button className="comment__action upvote">Up</button> */}
      {/*    <button className="comment__action downvote">Down</button> */}
      {/*  </span> */}
      {/* </div> */}
    </li>
  );
}

export default Comment;
