// @flow
import * as REACTION_TYPES from 'constants/reactions';
import * as ICONS from 'constants/icons';
import { COMMENT_PAGE_SIZE_TOP_LEVEL, SORT_BY } from 'constants/comment';
import React, { useEffect } from 'react';
import classnames from 'classnames';
import CommentView from 'component/comment';
import Spinner from 'component/spinner';
import Button from 'component/button';
import Card from 'component/common/card';
import CommentCreate from 'component/commentCreate';
import usePersistedState from 'effects/use-persisted-state';
import { ENABLE_COMMENT_REACTIONS } from 'config';
import Empty from 'component/common/empty';
import debounce from 'util/debounce';
import { useIsMobile } from 'effects/use-screensize';

const DEBOUNCE_SCROLL_HANDLER_MS = 200;

function scaleToDevicePixelRatio(value) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  if (devicePixelRatio < 1.0) {
    return Math.ceil(value / devicePixelRatio);
  }
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  allCommentIds: any,
  topLevelComments: Array<Comment>,
  topLevelTotalPages: number,
  commentsDisabledBySettings: boolean,
  fetchTopLevelComments: (string, number, number, number) => void,
  fetchComment: (string) => void,
  fetchReacts: (Array<string>) => Promise<any>,
  resetComments: (string) => void,
  uri: string,
  claimIsMine: boolean,
  myChannels: ?Array<ChannelClaim>,
  isFetchingComments: boolean,
  isFetchingReacts: boolean,
  linkedCommentId?: string,
  totalComments: number,
  fetchingChannels: boolean,
  myReactsByCommentId: ?{ [string]: Array<string> }, // "CommentId:MyChannelId" -> reaction array (note the ID concatenation)
  othersReactsById: ?{ [string]: { [REACTION_TYPES.LIKE | REACTION_TYPES.DISLIKE]: number } },
  activeChannelId: ?string,
};

function CommentList(props: Props) {
  const {
    allCommentIds,
    fetchTopLevelComments,
    fetchComment,
    fetchReacts,
    resetComments,
    uri,
    topLevelComments,
    topLevelTotalPages,
    commentsDisabledBySettings,
    claimIsMine,
    myChannels,
    isFetchingComments,
    isFetchingReacts,
    linkedCommentId,
    totalComments,
    fetchingChannels,
    myReactsByCommentId,
    othersReactsById,
    activeChannelId,
  } = props;

  const commentRef = React.useRef();
  const spinnerRef = React.useRef();
  const DEFAULT_SORT = ENABLE_COMMENT_REACTIONS ? SORT_BY.POPULARITY : SORT_BY.NEWEST;
  const [sort, setSort] = usePersistedState('comment-sort-by', DEFAULT_SORT);
  const [page, setPage] = React.useState(0);
  const isMobile = useIsMobile();
  const [expandedComments, setExpandedComments] = React.useState(!isMobile);
  const totalFetchedComments = allCommentIds ? allCommentIds.length : 0;

  // Display comments immediately if not fetching reactions
  // If not, wait to show comments until reactions are fetched
  const [readyToDisplayComments, setReadyToDisplayComments] = React.useState(
    Boolean(othersReactsById) || !ENABLE_COMMENT_REACTIONS
  );

  const hasNoComments = !totalComments;
  const moreBelow = page < topLevelTotalPages;

  const isMyComment = (channelId: string): boolean => {
    if (myChannels != null && channelId != null) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].claim_id === channelId) {
          return true;
        }
      }
    }
    return false;
  };

  function changeSort(newSort) {
    if (sort !== newSort) {
      setSort(newSort);
      setPage(0); // Invalidate existing comments
    }
  }

  // Reset comments
  useEffect(() => {
    if (page === 0) {
      resetComments(uri);
      setPage(1);
    }
  }, [page, uri, resetComments]);

  // Fetch top-level comments
  useEffect(() => {
    if (page !== 0) {
      if (page === 1 && linkedCommentId) {
        fetchComment(linkedCommentId);
      }

      fetchTopLevelComments(uri, page, COMMENT_PAGE_SIZE_TOP_LEVEL, sort);
    }
  }, [fetchTopLevelComments, uri, page, resetComments, sort, linkedCommentId, fetchComment]);

  // Fetch reacts
  useEffect(() => {
    if (totalFetchedComments > 0 && ENABLE_COMMENT_REACTIONS && !fetchingChannels && !isFetchingReacts) {
      let idsForReactionFetch;

      if (!othersReactsById || !myReactsByCommentId) {
        idsForReactionFetch = allCommentIds;
      } else {
        idsForReactionFetch = allCommentIds.filter((commentId) => {
          const key = activeChannelId ? `${commentId}:${activeChannelId}` : commentId;
          return !othersReactsById[key] || (activeChannelId && !myReactsByCommentId[key]);
        });
      }

      if (idsForReactionFetch.length !== 0) {
        fetchReacts(idsForReactionFetch)
          .then(() => {
            setReadyToDisplayComments(true);
          })
          .catch(() => setReadyToDisplayComments(true));
      }
    }
  }, [
    totalFetchedComments,
    allCommentIds,
    othersReactsById,
    myReactsByCommentId,
    fetchReacts,
    uri,
    activeChannelId,
    fetchingChannels,
    isFetchingReacts,
  ]);

  // Scroll to linked-comment
  useEffect(() => {
    if (readyToDisplayComments && linkedCommentId && commentRef && commentRef.current) {
      commentRef.current.scrollIntoView({ block: 'start' });
      window.scrollBy(0, -125);
    }
  }, [readyToDisplayComments, linkedCommentId]);

  // Infinite scroll
  useEffect(() => {
    function shouldFetchNextPage(page, topLevelTotalPages, window, document, yPrefetchPx = 1000) {
      if (!spinnerRef || !spinnerRef.current) {
        return false;
      }

      const rect = spinnerRef.current.getBoundingClientRect(); // $FlowFixMe
      const windowH = window.innerHeight || document.documentElement.clientHeight; // $FlowFixMe
      const windowW = window.innerWidth || document.documentElement.clientWidth; // $FlowFixMe

      const isApproachingViewport = yPrefetchPx !== 0 && rect.top < windowH + scaleToDevicePixelRatio(yPrefetchPx);

      const isInViewport =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        // $FlowFixMe
        rect.top <= windowH &&
        // $FlowFixMe
        rect.left <= windowW;

      return (isInViewport || isApproachingViewport) && page < topLevelTotalPages;
    }

    const handleCommentScroll = debounce(() => {
      if (!isMobile && shouldFetchNextPage(page, topLevelTotalPages, window, document)) {
        setPage(page + 1);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (!isFetchingComments && readyToDisplayComments && moreBelow && spinnerRef && spinnerRef.current) {
      if (shouldFetchNextPage(page, topLevelTotalPages, window, document, 0)) {
        setPage(page + 1);
      } else {
        window.addEventListener('scroll', handleCommentScroll);
        return () => window.removeEventListener('scroll', handleCommentScroll);
      }
    }
  }, [
    isMobile,
    page,
    moreBelow,
    spinnerRef,
    isFetchingComments,
    readyToDisplayComments,
    topLevelComments.length,
    topLevelTotalPages,
  ]);

  const displayedComments = readyToDisplayComments ? topLevelComments : [];

  return (
    <Card
      title={
        totalComments > 0
          ? totalComments === 1
            ? __('1 comment')
            : __('%total_comments% comments', { total_comments: totalComments })
          : __('Leave a comment')
      }
      titleActions={
        <>
          {totalComments > 1 && ENABLE_COMMENT_REACTIONS && (
            <span className="comment__sort">
              <Button
                button="alt"
                label={__('Best')}
                icon={ICONS.BEST}
                iconSize={18}
                onClick={() => changeSort(SORT_BY.POPULARITY)}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': sort === SORT_BY.POPULARITY,
                })}
              />
              <Button
                button="alt"
                label={__('Controversial')}
                icon={ICONS.CONTROVERSIAL}
                iconSize={18}
                onClick={() => changeSort(SORT_BY.CONTROVERSY)}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': sort === SORT_BY.CONTROVERSY,
                })}
              />
              <Button
                button="alt"
                label={__('New')}
                icon={ICONS.NEW}
                iconSize={18}
                onClick={() => changeSort(SORT_BY.NEWEST)}
                className={classnames(`button-toggle`, {
                  'button-toggle--active': sort === SORT_BY.NEWEST,
                })}
              />
            </span>
          )}
          <Button
            button="alt"
            icon={ICONS.REFRESH}
            title={__('Refresh')}
            onClick={() => {
              setPage(0);
            }}
          />
        </>
      }
      actions={
        <>
          <CommentCreate uri={uri} />

          {!commentsDisabledBySettings && !isFetchingComments && hasNoComments && (
            <Empty padded text={__('That was pretty deep. What do you think?')} />
          )}

          <ul
            className={classnames({
              comments: expandedComments,
              'comments--contracted': !expandedComments,
            })}
            ref={commentRef}
          >
            {topLevelComments &&
              displayedComments &&
              displayedComments.map((comment) => {
                return (
                  <CommentView
                    isTopLevel
                    threadDepth={3}
                    key={comment.comment_id}
                    uri={uri}
                    authorUri={comment.channel_url}
                    author={comment.channel_name}
                    claimId={comment.claim_id}
                    commentId={comment.comment_id}
                    message={comment.comment}
                    timePosted={comment.timestamp * 1000}
                    claimIsMine={claimIsMine}
                    commentIsMine={comment.channel_id && isMyComment(comment.channel_id)}
                    linkedCommentId={linkedCommentId}
                    isPinned={comment.is_pinned}
                    supportAmount={comment.support_amount}
                    numDirectReplies={comment.replies}
                    isFiat={comment.is_fiat}
                  />
                );
              })}
          </ul>

          {isMobile && (
            <div className="card__bottom-actions--comments">
              {moreBelow && (
                <Button
                  button="link"
                  title={!expandedComments ? __('Expand Comments') : __('Load More')}
                  label={!expandedComments ? __('Expand') : __('More')}
                  onClick={() => {
                    if (!expandedComments) {
                      setExpandedComments(true);
                    } else {
                      setPage(page + 1);
                    }
                  }}
                />
              )}
              {expandedComments && (
                <Button
                  button="link"
                  title={__('Collapse Thread')}
                  label={__('Collapse')}
                  onClick={() => {
                    setExpandedComments(false);
                  }}
                />
              )}
            </div>
          )}

          {(isFetchingComments || (!isMobile && moreBelow)) && (
            <div className="main--empty" ref={spinnerRef}>
              <Spinner type="small" />
            </div>
          )}
        </>
      }
    />
  );
}

export default CommentList;
