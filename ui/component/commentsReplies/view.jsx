// @flow
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import Comment from 'component/comment';
import React from 'react';
import Spinner from 'component/spinner';

type Props = {
  uri: string,
  linkedCommentId?: string,
  threadDepth: number,
  numDirectReplies: number, // Total replies for parentId as reported by 'comment[replies]'. Includes blocked items.
  hasMore: boolean,
  supportDisabled: boolean,
  onShowMore?: () => void,
  // redux
  fetchedReplies: Array<Comment>,
  claimIsMine: boolean,
  isFetching: boolean,
};

export default function CommentsReplies(props: Props) {
  const {
    uri,
    fetchedReplies,
    claimIsMine,
    linkedCommentId,
    threadDepth,
    numDirectReplies,
    isFetching,
    hasMore,
    supportDisabled,
    onShowMore,
  } = props;

  const [isExpanded, setExpanded] = React.useState(true);

  return !numDirectReplies ? null : (
    <div className="comment__replies-container">
      {!isExpanded ? (
        <div className="comment__actions--nested">
          <Button
            className="comment__action"
            label={__('Show Replies')}
            onClick={() => setExpanded(!isExpanded)}
            icon={isExpanded ? ICONS.UP : ICONS.DOWN}
          />
        </div>
      ) : (
        <div className="comment__replies">
          {fetchedReplies.length > 0 && (
            <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setExpanded(false)} />
          )}

          <ul className="comments--replies">
            {fetchedReplies.map((comment) => (
              <Comment
                key={comment.comment_id}
                threadDepth={threadDepth}
                uri={uri}
                comment={comment}
                claimIsMine={claimIsMine}
                linkedCommentId={linkedCommentId}
                supportDisabled={supportDisabled}
              />
            ))}
          </ul>
        </div>
      )}

      {isExpanded && fetchedReplies && hasMore && (
        <div className="comment__actions--nested">
          <Button
            button="link"
            label={__('Show more')}
            onClick={() => onShowMore && onShowMore()}
            className="button--uri-indicator"
          />
        </div>
      )}

      {isFetching && (
        <div className="comment__replies-container">
          <div className="comment__actions--nested">
            <Spinner type="small" />
          </div>
        </div>
      )}
    </div>
  );
}
