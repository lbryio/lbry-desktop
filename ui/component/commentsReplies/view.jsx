// @flow
import 'scss/component/_comments.scss';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import Comment from 'component/comment';
import React from 'react';
import Spinner from 'component/spinner';

type Props = {
  claimIsMine: boolean,
  fetchedReplies: Array<Comment>,
  hasMore: boolean,
  isFetchingByParentId: { [string]: boolean },
  linkedCommentId?: string,
  numDirectReplies: number, // Total replies for parentId as reported by 'comment[replies]'. Includes blocked items.
  parentId: string,
  resolvedReplies: Array<Comment>,
  supportDisabled: boolean,
  threadDepth: number,
  uri: string,
  userCanComment: boolean,
  doResolveUris: (Array<string>) => void,
  onShowMore?: () => void,
};

function CommentsReplies(props: Props) {
  const {
    claimIsMine,
    fetchedReplies,
    hasMore,
    isFetchingByParentId,
    linkedCommentId,
    numDirectReplies,
    parentId,
    resolvedReplies,
    supportDisabled,
    threadDepth,
    uri,
    userCanComment,
    doResolveUris,
    onShowMore,
  } = props;

  const [isExpanded, setExpanded] = React.useState(true);
  const [commentsToDisplay, setCommentsToDisplay] = React.useState(fetchedReplies);

  const isResolvingReplies = fetchedReplies && resolvedReplies.length !== fetchedReplies.length;
  const alreadyResolved = !isResolvingReplies && resolvedReplies.length !== 0;
  const canDisplayComments = commentsToDisplay && commentsToDisplay.length === fetchedReplies.length;

  // Batch resolve comment channel urls
  React.useEffect(() => {
    if (!fetchedReplies || alreadyResolved) return;

    const urisToResolve = [];
    fetchedReplies.forEach(({ channel_url }) => channel_url !== undefined && urisToResolve.push(channel_url));

    if (urisToResolve.length > 0) doResolveUris(urisToResolve);
  }, [alreadyResolved, doResolveUris, fetchedReplies]);

  // Wait to only display topLevelComments after resolved or else
  // other components will try to resolve again, like channelThumbnail
  React.useEffect(() => {
    if (!isResolvingReplies) setCommentsToDisplay(fetchedReplies);
  }, [isResolvingReplies, fetchedReplies]);

  return !numDirectReplies ? null : (
    <div className="commentReplies__container">
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
          <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setExpanded(false)} />

          <ul className="comments--replies">
            {!isResolvingReplies &&
              commentsToDisplay &&
              commentsToDisplay.length > 0 &&
              commentsToDisplay.map((comment: Comment) => (
                <Comment
                  claimIsMine={claimIsMine}
                  comment={comment}
                  commentingEnabled={userCanComment}
                  key={comment.comment_id}
                  linkedCommentId={linkedCommentId}
                  supportDisabled={supportDisabled}
                  threadDepth={threadDepth}
                  uri={uri}
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

      {(isFetchingByParentId[parentId] || isResolvingReplies || !canDisplayComments) && (
        <div className="comment__actions--nested">
          <Spinner type="small" />
        </div>
      )}
    </div>
  );
}

export default CommentsReplies;
