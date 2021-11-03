// @flow
import 'scss/component/_comments-list.scss';
import { COMMENT_PAGE_SIZE_TOP_LEVEL, SORT_BY } from 'constants/comment';
import { ENABLE_COMMENT_REACTIONS } from 'config';
import { getChannelIdFromClaim } from 'util/claim';
import { scaleToDevicePixelRatio } from 'util/scale';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import * as REACTION_TYPES from 'constants/reactions';
import Button from 'component/button';
import Card from 'component/common/card';
import classnames from 'classnames';
import CommentCreate from 'component/commentCreate';
import CommentView from 'component/comment';
import debounce from 'util/debounce';
import Empty from 'component/common/empty';
import React, { useEffect } from 'react';
import Spinner from 'component/spinner';
import usePersistedState from 'effects/use-persisted-state';

const DEBOUNCE_SCROLL_HANDLER_MS = 200;

type Props = {
  activeChannelId: ?string,
  allCommentIds: any,
  claim: ?Claim,
  claimIsMine: boolean,
  commentsAreExpanded?: boolean,
  fetchingChannels: boolean,
  isFetchingComments: boolean,
  isFetchingCommentsById: boolean,
  isFetchingReacts: boolean,
  linkedCommentId?: string,
  myReactsByCommentId: ?{ [string]: Array<string> }, // "CommentId:MyChannelId" -> reaction array (note the ID concatenation)
  othersReactsById: ?{ [string]: { [REACTION_TYPES.LIKE | REACTION_TYPES.DISLIKE]: number } },
  pinnedComments: Array<Comment>,
  resolvedComments: Array<Comment>,
  settingsByChannelId: { [channelId: string]: PerChannelSettings },
  topLevelComments: Array<Comment>,
  topLevelTotalPages: number,
  totalComments: number,
  uri: string,
  doResolveUris: (Array<string>) => void,
  fetchComment: (string) => void,
  fetchReacts: (Array<string>) => Promise<any>,
  fetchTopLevelComments: (number, number, string) => void,
  resetComments: () => void,
};

function CommentsList(props: Props) {
  const {
    activeChannelId,
    allCommentIds,
    claim,
    claimIsMine,
    commentsAreExpanded,
    doResolveUris,
    fetchingChannels,
    fetchReacts,
    isFetchingComments,
    isFetchingReacts,
    linkedCommentId,
    myReactsByCommentId,
    othersReactsById,
    pinnedComments,
    resolvedComments,
    settingsByChannelId,
    topLevelComments,
    topLevelTotalPages,
    totalComments,
    uri,
    fetchComment,
    fetchTopLevelComments,
    resetComments,
  } = props;

  const isMobile = useIsMobile();
  const isMediumScreen = useIsMediumScreen();
  const desktopView = !isMobile && !isMediumScreen;
  const spinnerRef = React.useRef();
  const DEFAULT_SORT = ENABLE_COMMENT_REACTIONS ? SORT_BY.POPULARITY : SORT_BY.NEWEST;
  const [sort, setSort] = usePersistedState('comment-sort-by', DEFAULT_SORT);
  const [page, setPage] = React.useState(0);
  const [commentsToDisplay, setCommentsToDisplay] = React.useState(topLevelComments);
  const hasDefaultExpansion = commentsAreExpanded || desktopView;
  const [expandedComments, setExpandedComments] = React.useState(hasDefaultExpansion);

  const totalFetchedComments = allCommentIds ? allCommentIds.length : 0;
  const channelId = getChannelIdFromClaim(claim);
  const channelSettings = channelId ? settingsByChannelId[channelId] : undefined;
  const moreBelow = page < topLevelTotalPages;
  const isResolvingComments = topLevelComments && resolvedComments.length !== topLevelComments.length;
  const alreadyResolved = !isResolvingComments && resolvedComments.length !== 0;
  const canDisplayComments = commentsToDisplay && commentsToDisplay.length === topLevelComments.length;

  // Display comments immediately if not fetching reactions
  // If not, wait to show comments until reactions are fetched
  const [readyToDisplayComments, setReadyToDisplayComments] = React.useState(
    Boolean(othersReactsById) || !ENABLE_COMMENT_REACTIONS
  );

  function changeSort(newSort: string) {
    if (sort !== newSort) {
      setSort(newSort);
      setPage(0); // Invalidate existing comments
    }
  }

  // Reset comments
  useEffect(() => {
    if (page === 0) {
      if (claim) resetComments();
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, uri, resetComments]); // 'claim' is derived from 'uri'

  // Fetch top-level comments
  useEffect(() => {
    if (page !== 0) {
      if (page === 1 && linkedCommentId) {
        fetchComment(linkedCommentId);
      }

      fetchTopLevelComments(page, COMMENT_PAGE_SIZE_TOP_LEVEL, sort);
    }
  }, [fetchComment, fetchTopLevelComments, linkedCommentId, page, sort, uri]);

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
    activeChannelId,
    allCommentIds,
    fetchReacts,
    fetchingChannels,
    isFetchingReacts,
    myReactsByCommentId,
    othersReactsById,
    totalFetchedComments,
  ]);

  // Scroll to linked-comment
  useEffect(() => {
    if (linkedCommentId) {
      window.pendingLinkedCommentScroll = true;
    } else {
      delete window.pendingLinkedCommentScroll;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  useEffect(() => {
    function shouldFetchNextPage(page, topLevelTotalPages, window, document, yPrefetchPx = 1000) {
      if (!spinnerRef || !spinnerRef.current) return false;

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
      if (shouldFetchNextPage(page, topLevelTotalPages, window, document)) {
        setPage(page + 1);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (hasDefaultExpansion && !isFetchingComments && canDisplayComments && readyToDisplayComments && moreBelow) {
      if (shouldFetchNextPage(page, topLevelTotalPages, window, document, 0)) {
        setPage(page + 1);
      } else {
        window.addEventListener('scroll', handleCommentScroll);
        return () => window.removeEventListener('scroll', handleCommentScroll);
      }
    }
  }, [
    canDisplayComments,
    hasDefaultExpansion,
    isFetchingComments,
    moreBelow,
    page,
    readyToDisplayComments,
    topLevelTotalPages,
  ]);

  // Wait to only display topLevelComments after resolved or else
  // other components will try to resolve again, like channelThumbnail
  useEffect(() => {
    if (!isResolvingComments) setCommentsToDisplay(topLevelComments);
  }, [isResolvingComments, topLevelComments]);

  // Batch resolve comment channel urls
  useEffect(() => {
    if (!topLevelComments || alreadyResolved) return;

    const urisToResolve = [];
    topLevelComments.forEach(({ channel_url }) => channel_url !== undefined && urisToResolve.push(channel_url));

    if (urisToResolve.length > 0) doResolveUris(urisToResolve);
  }, [alreadyResolved, doResolveUris, topLevelComments]);

  const getCommentElems = (comments: Array<Comment>) =>
    comments.map((comment: Comment) => (
      <CommentView
        claimIsMine={claimIsMine}
        comment={comment}
        isTopLevel
        key={comment.comment_id}
        linkedCommentId={linkedCommentId}
        threadDepth={3}
        uri={uri}
      />
    ));

  const sortButton = (label: string, icon: string, sortOption: string) => (
    <Button
      button="alt"
      label={label}
      icon={icon}
      iconSize={18}
      onClick={() => changeSort(sortOption)}
      className={classnames(`button-toggle`, {
        'button-toggle--active': sort === sortOption,
      })}
    />
  );

  return (
    <Card
      className="card--enable-overflow"
      title={
        (totalComments === 0 && __('Leave a comment')) ||
        (totalComments === 1 && __('1 comment')) ||
        __('%total_comments% comments', { total_comments: totalComments })
      }
      titleActions={
        <>
          {totalComments > 1 && ENABLE_COMMENT_REACTIONS && (
            <span className="comment__sort">
              {sortButton(__('Best'), ICONS.BEST, SORT_BY.POPULARITY)}
              {sortButton(__('Controversial'), ICONS.CONTROVERSIAL, SORT_BY.CONTROVERSY)}
              {sortButton(__('New'), ICONS.NEW, SORT_BY.NEWEST)}
            </span>
          )}
          <Button button="alt" icon={ICONS.REFRESH} title={__('Refresh')} onClick={() => setPage(0)} />
        </>
      }
      actions={
        <>
          <CommentCreate uri={uri} />

          {channelSettings && channelSettings.comments_enabled && !isFetchingComments && !totalComments && (
            <Empty padded text={__('That was pretty deep. What do you think?')} />
          )}

          <ul
            className={classnames('comments', {
              'comments--contracted': !desktopView && !expandedComments,
            })}
          >
            {readyToDisplayComments && pinnedComments && getCommentElems(pinnedComments)}
            {readyToDisplayComments && commentsToDisplay && getCommentElems(commentsToDisplay)}
          </ul>

          {!hasDefaultExpansion && (
            <div className="card__bottom-actions--comments">
              {(!expandedComments || moreBelow) && (
                <Button
                  button="link"
                  title={!expandedComments ? __('Expand') : __('More')}
                  label={!expandedComments ? __('Expand') : __('More')}
                  onClick={() => (!expandedComments ? setExpandedComments(true) : setPage(page + 1))}
                />
              )}
              {expandedComments && (
                <Button
                  button="link"
                  title={__('Collapse')}
                  label={__('Collapse')}
                  onClick={() => setExpandedComments(false)}
                />
              )}
            </div>
          )}

          {(isFetchingComments || (hasDefaultExpansion && moreBelow) || !canDisplayComments) && (
            <div className="main--empty" ref={spinnerRef}>
              <Spinner type="small" />
            </div>
          )}
        </>
      }
    />
  );
}

export default CommentsList;
