// @flow
import React, { useEffect } from 'react';
import Comment from 'component/comment';

<<<<<<< HEAD
type Props = {
  comments: Array<any>,
  fetchComments: string => void,
=======
type CommentListProps = {
  comments: Array<any>,
  fetchList: string => void,
>>>>>>> flat comments
  uri: string,
};

<<<<<<< HEAD
function CommentList(props: Props) {
  const { fetchComments, uri, comments } = props;
=======
type CommentProps = {
  commentId: string,
  claimId: string,
  author: string,
  message: string,
  parentId: number,
  timePosted: number,
};

class CommentList extends React.PureComponent<CommentListProps> {
  componentDidMount() {
    this.fetchComments(this.props);
  }

  fetchComments = (props: CommentListProps) => {
    const { fetchList, uri } = props;
    fetchList(uri);
  };
>>>>>>> flat comments

  useEffect(() => {
    fetchComments(uri);
  }, [fetchComments, uri]);

<<<<<<< HEAD
  return (
    <ul className="comments">
      {comments &&
        comments.map(comment => {
          return (
            <Comment
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
=======
    if (!comments) {
      return null;
    }

    return (
      <section>
        <ul className="comments">
          {comments.map(comment => {
            return (
              <Comment
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
      </section>
    );
  }
}

class Comment extends React.PureComponent<CommentProps> {
  render() {
    return (
      <li className={this.props.parentId ? 'comment reply' : 'comment'}>
        <div className="comment__meta card__actions--between">
          {this.props.author && <strong>{this.props.author}</strong>}
          {!this.props.author && <strong>Anonymous</strong>}

          <time dateTime={this.props.timePosted}>{relativeDate(this.props.timePosted)}</time>
        </div>

        <div className="comment__content">{this.props.message}</div>
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
>>>>>>> flat comments
}

export default CommentList;
