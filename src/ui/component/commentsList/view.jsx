// @flow
import * as React from 'react';

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
      <div>
        <ul>
          {comments['comments'].map(comment => {
            console.log(comment.message);
            return (
              <li key={comment.author + comment.comment_id}>
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
      </div>
    );
  }
}

class Comment extends React.PureComponent<CommentProps> {
  render() {
    return (
      <span className="button button--no-style navigation__link card__message">
        <div className="media__info-text">
          <div className="card__actions--between">
            <div>Author: {this.props.author}</div>
            <div>Date: {this.props.timePosted}</div>
          </div>
          <div className="media__subtitle__channel">Message: {this.props.message}</div>
          <div className="card__actions--between">
            <button className={'button button--primary'}>Reply</button>
            <div>
              <button className={'button button--primary'}>Up</button>
              <button className={'button button--primary'}>Down</button>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default CommentList;
