// @flow
import React from 'react';
import relativeDate from 'tiny-relative-date';
import Button from '../button';

type Props = {
  author: string,
  authorUri: string,
  message: string,
  timePosted: number,
};

function Comment(props: Props) {
  const { author, authorUri, timePosted, message } = props;

  return (
    <li className="comment">
      <div className="comment__meta">
        <Button className="button--uri-indicator truncated-text comment__author" navigate={authorUri} label={author} />
        <time className="comment__time" dateTime={timePosted}>
          {relativeDate(timePosted)}
        </time>
      </div>

      <p className={'comment__message'}>{message}</p>
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
