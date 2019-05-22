// @flow
import * as React from 'react';
import relativeDate from 'tiny-relative-date';

type CommentListProps = {
  comments: {},
  fetchList: string => void,
  uri: string,
  isLoading: boolean,
};

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

  fetchComments = (props: Props) => {
    const { fetchList, uri } = props;
    fetchList(uri);
  };

  render() {
    const { comments } = this.props;

    if (!comments) {
      return null;
    }

    return (
      <ul className="comments">
        {comments['comments'].map(comment => {
          console.log(comment.message);
          return (
            <Comment
              author={comment.author}
              claimId={comment.claim_id}
              commentId={comment.comment_id}
              key={comment.author + comment.comment_id}
              message={comment.message}
              parentId={comment.parent_id}
              timePosted={comment.time_posted}
            />
          );
        })}
      </ul>
    );
  }
}

class Comment extends React.PureComponent<CommentProps> {
  render() {
    return (
      <li className={this.props.parentId ? 'comment reply' : 'comment'}>
        <div className="comment__meta card__actions--between">
          <strong>{this.props.author}</strong>
          <time dateTime={this.props.timePosted}>{relativeDate(this.props.timePosted)}</time>
        </div>

        <div className="comment__content">{this.props.message}</div>

        <div className="comment__actions card__actions--between">
          <button className={'button button--primary'}>Reply</button>

          <span className="comment__actions-wrap">
            <button className="comment__action upvote">Up</button>
            <button className="comment__action downvote">Down</button>
          </span>
        </div>
      </li>
    );
  }
}

export default CommentList;
