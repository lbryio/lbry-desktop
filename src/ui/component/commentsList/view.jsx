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
      <li className="comment">
        <div className="comment__meta card__actions--between">
          <div>{this.props.author}</div>
          <time datatime={this.props.timePosted}>{relativeDate(this.props.timePosted)}</time>
        </div>

        <div className="comment__content">{this.props.message}</div>

        <div className="comment__actions card__actions--between">
          <button className={'button button--primary'}>Reply</button>

          <span>
            <button className="comment__action button button--secondary">Up</button>
            <button className="comment__action button button--secondary">Down</button>
          </span>
        </div>
      </li>
    );
  }
}

export default CommentList;
