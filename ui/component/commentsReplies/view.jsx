// @flow
import { SITE_NAME } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Comment from 'component/comment';
import Button from 'component/button';
import CommentCreate from 'component/commentCreate';
import { useHistory } from 'react-router';

type Props = {
  comments: Array<any>,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  linkedComment?: Comment,
  parentId: string,
  commentingEnabled: boolean,
  doToast: ({ message: string }) => void,
};

function CommentsReplies(props: Props) {
  const { uri, comments, claimIsMine, myChannels, linkedComment, parentId, commentingEnabled, doToast } = props;
  const {
    push,
    location: { pathname },
  } = useHistory();
  const [isReplying, setReplying] = React.useState(false);
  const [isExpanded, setExpanded] = React.useState(false);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(9);
  const sortedComments = comments ? [...comments].reverse() : [];
  const numberOfComments = comments ? comments.length : 0;
  const linkedCommentId = linkedComment ? linkedComment.comment_id : '';
  const commentsIndexOfLInked = comments && sortedComments.findIndex(e => e.comment_id === linkedCommentId);
  const hasChannels = myChannels && myChannels.length > 0;

  function showMore() {
    if (start > 0) {
      setStart(0);
    } else {
      setEnd(numberOfComments);
    }
  }

  // todo: implement comment_list --mine in SDK so redux can grab with selectCommentIsMine
  function isMyComment(channelId: string) {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  }

  function handleCommentDone() {
    if (!isExpanded) {
      setExpanded(true);
      setStart(numberOfComments || 0);
    }
    setEnd(numberOfComments + 1);
    setReplying(false);
  }

  function handleCommentReply() {
    if (!hasChannels) {
      push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`);
      doToast({ message: __('A channel is required to comment on %SITE_NAME%', { SITE_NAME }) });
    } else {
      setReplying(!isReplying);
    }
  }

  React.useEffect(() => {
    if (
      setStart &&
      setEnd &&
      setExpanded &&
      linkedCommentId &&
      Number.isInteger(commentsIndexOfLInked) &&
      commentsIndexOfLInked > -1
    ) {
      setStart(commentsIndexOfLInked);
      setEnd(commentsIndexOfLInked + 1);
      setExpanded(true);
    }
  }, [setStart, setEnd, setExpanded, linkedCommentId, commentsIndexOfLInked]);

  const displayedComments = sortedComments.slice(start, end);

  return (
    <li className="comment__replies-container">
      <div className="comment__actions">
        <Button
          requiresAuth={IS_WEB}
          label={commentingEnabled ? __('Reply') : __('Log in to reply')}
          className="comment__action"
          onClick={handleCommentReply}
          icon={ICONS.REPLY}
        />
        {Boolean(numberOfComments) && (
          <Button
            className="comment__action"
            label={
              isExpanded
                ? __('Hide %number% Replies', { number: numberOfComments })
                : __('Show %number% Replies', { number: numberOfComments })
            }
            onClick={() => setExpanded(!isExpanded)}
            icon={ICONS.DOWN}
          />
        )}
      </div>
      {comments && displayedComments && isExpanded && (
        <div>
          <div className="comment__replies">
            <Button className="comment__threadline" aria-label="Hide Replies" onClick={() => setExpanded(false)} />

            <ul className="comments--replies">
              {displayedComments.map(comment => {
                return (
                  <Comment
                    uri={uri}
                    authorUri={comment.channel_url}
                    author={comment.channel_name}
                    claimId={comment.claim_id}
                    commentId={comment.comment_id}
                    key={comment.comment_id}
                    message={comment.comment}
                    parentId={comment.parent_id || null}
                    timePosted={comment.timestamp * 1000}
                    claimIsMine={claimIsMine}
                    commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                    linkedComment={linkedComment}
                  />
                );
              })}
            </ul>
          </div>
          {!isReplying && (
            <Button
              requiresAuth={IS_WEB}
              label={commentingEnabled ? __('Reply') : __('Log in to reply')}
              className="comment__action--nested"
              onClick={handleCommentReply}
              icon={ICONS.REPLY}
            />
          )}
        </div>
      )}
      {isExpanded && comments && (end < numberOfComments || start > 0) && (
        <div className="comment__actions">
          <Button button="link" label={__('Show more')} onClick={showMore} className="button--uri-indicator" />
        </div>
      )}

      {isReplying ? (
        <CommentCreate
          isNested={isExpanded}
          key={parentId}
          uri={uri}
          parentId={parentId}
          onDoneReplying={() => handleCommentDone()}
          onCancelReplying={() => setReplying(false)}
        />
      ) : (
        ''
      )}
    </li>
  );
}

export default CommentsReplies;
