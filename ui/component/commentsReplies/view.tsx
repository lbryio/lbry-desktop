import * as ICONS from "constants/icons";
import Button from "component/button";
import Comment from "component/comment";
import React from "react";
import Spinner from "component/spinner";

type Props = {
  fetchedReplies: Array<LbryComment>;
  resolvedReplies: Array<LbryComment>;
  uri: string;
  parentId: string;
  claimIsMine: boolean;
  linkedCommentId?: string;
  userCanComment: boolean;
  threadDepth: number;
  numDirectReplies: number; // Total replies for parentId as reported by 'comment[replies]'. Includes blocked items.,
  isFetchingByParentId: {
    [key: string]: boolean;
  };
  hasMore: boolean;
  supportDisabled: boolean;
  doResolveUris: (arg1: Array<string>) => void;
  onShowMore?: () => void;
};

function CommentsReplies(props: Props) {
  const {
    uri,
    parentId,
    fetchedReplies,
    resolvedReplies,
    claimIsMine,
    linkedCommentId,
    userCanComment,
    threadDepth,
    numDirectReplies,
    isFetchingByParentId,
    hasMore,
    supportDisabled,
    doResolveUris,
    onShowMore,
  } = props;

  const [isExpanded, setExpanded] = React.useState(true);
  const [commentsToDisplay, setCommentsToDisplay] = React.useState(fetchedReplies);
  const isResolvingReplies = fetchedReplies && resolvedReplies.length !== fetchedReplies.length;
  const alreadyResolved = !isResolvingReplies && resolvedReplies.length !== 0;
  const canDisplayComments = commentsToDisplay && fetchedReplies && commentsToDisplay.length === fetchedReplies.length;

  // Batch resolve comment channel urls
  React.useEffect(() => {
    if (!fetchedReplies || alreadyResolved) return;

    const urisToResolve: unknown = [];
    // @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    fetchedReplies.map(({ channel_url }) => channel_url !== undefined && urisToResolve.push(channel_url));

    // @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'. | TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string[]'.
    if (urisToResolve.length > 0) doResolveUris(urisToResolve);
  }, [alreadyResolved, doResolveUris, fetchedReplies]);

  // Wait to only display topLevelComments after resolved or else
  // other components will try to resolve again, like channelThumbnail
  React.useEffect(() => {
    if (!isResolvingReplies) setCommentsToDisplay(fetchedReplies);
  }, [isResolvingReplies, fetchedReplies]);

  return !numDirectReplies ? null : (
    <div className="comment__replies-container">
      {!isExpanded ? (
        <div className="comment__actions--nested">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            className="comment__action"
            label={__("Show Replies")}
            onClick={() => setExpanded(!isExpanded)}
            icon={isExpanded ? ICONS.UP : ICONS.DOWN}
          />
        </div>
      ) : (
        <div className="comment__replies">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setExpanded(false)} />

          <ul className="comments--replies">
            {!isResolvingReplies &&
              commentsToDisplay &&
              commentsToDisplay.length > 0 &&
              commentsToDisplay.map((comment) => (
                <Comment
                  key={comment.comment_id}
                  threadDepth={threadDepth}
                  uri={uri}
                  comment={comment}
                  claimIsMine={claimIsMine}
                  linkedCommentId={linkedCommentId}
                  // @ts-expect-error - TS2322 (ts-migration)
                  commentingEnabled={userCanComment}
                  supportDisabled={supportDisabled}
                />
              ))}
          </ul>
        </div>
      )}
      {isExpanded && fetchedReplies && hasMore && (
        <div className="comment__actions--nested">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            button="link"
            label={__("Show more")}
            onClick={() => onShowMore && onShowMore()}
            className="button--uri-indicator"
          />
        </div>
      )}
      {(isFetchingByParentId[parentId] || isResolvingReplies || !canDisplayComments) && (
        <div className="comment__replies-container">
          <div className="comment__actions--nested">
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Spinner type="small" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentsReplies;
