// @flow
import {
  COMMENT_PAGE_SIZE_TOP_LEVEL,
  SORT_BY,
  LINKED_COMMENT_QUERY_PARAM,
  THREAD_COMMENT_QUERY_PARAM,
} from 'constants/comment';
import { ENABLE_COMMENT_REACTIONS } from 'config';
import { useIsMobile, useIsMediumScreen } from 'effects/use-screensize';
import { getCommentsListTitle } from 'util/comments';
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
import useGetUserMemberships from 'effects/use-get-user-memberships';
import { useHistory } from 'react-router-dom';

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
  pinnedComments: Array<Comment>,
  topLevelComments: Array<Comment>,
  topLevelTotalPages: number,
  uri: string,
  claimId?: string,
  channelId?: string,
  claimIsMine: boolean,
  isFetchingComments: boolean,
  isFetchingCommentsById: boolean,
  isFetchingReacts: boolean,
  linkedCommentId?: string,
  totalComments: number,
  fetchingChannels: boolean,
  myReactsByCommentId: ?{ [string]: Array<string> }, // "CommentId:MyChannelId" -> reaction array (note the ID concatenation)
  othersReactsById: ?{ [string]: { [REACTION_TYPES.LIKE | REACTION_TYPES.DISLIKE]: number } },
  activeChannelId: ?string,
  settingsByChannelId: { [channelId: string]: PerChannelSettings },
  commentsAreExpanded?: boolean,
  threadCommentId: ?string,
  threadComment: ?Comment,
  notInDrawer?: boolean,
  threadCommentAncestors: ?Array<string>,
  linkedCommentAncestors: ?Array<string>,
  fetchTopLevelComments: (uri: string, parentId: ?string, page: number, pageSize: number, sortBy: number) => void,
  fetchComment: (commentId: string) => void,
  fetchReacts: (commentIds: Array<string>) => Promise<any>,
  resetComments: (claimId: string) => void,
  claimsByUri: { [string]: any },
  doFetchUserMemberships: (claimIdCsv: string) => void,
};

export default function CommentList(props: Props) {
  const {
    allCommentIds,
    uri,
    pinnedComments,
    topLevelComments,
    topLevelTotalPages,
    claimId,
    channelId,
    claimIsMine,
    isFetchingComments,
    isFetchingReacts,
    linkedCommentId,
    totalComments,
    fetchingChannels,
    myReactsByCommentId,
    othersReactsById,
    activeChannelId,
    settingsByChannelId,
    commentsAreExpanded,
    threadCommentId,
    threadComment,
    notInDrawer,
    threadCommentAncestors,
    linkedCommentAncestors,
    fetchTopLevelComments,
    fetchComment,
    fetchReacts,
    resetComments,
    claimsByUri,
    doFetchUserMemberships,
  } = props;

  const threadRedirect = React.useRef(false);

  const {
    push,
    location: { pathname, search },
  } = useHistory();

  const isMobile = useIsMobile();
  const isMediumScreen = useIsMediumScreen();

  const currentFetchedPage = Math.ceil(topLevelComments.length / COMMENT_PAGE_SIZE_TOP_LEVEL);
  const spinnerRef = React.useRef();
  const commentListRef = React.useRef();
  const DEFAULT_SORT = ENABLE_COMMENT_REACTIONS ? SORT_BY.POPULARITY : SORT_BY.NEWEST;
  const [sort, setSort] = usePersistedState('comment-sort-by', DEFAULT_SORT);
  const [page, setPage] = React.useState(currentFetchedPage > 0 ? currentFetchedPage : 1);
  const [didInitialPageFetch, setInitialPageFetch] = React.useState(false);
  const hasDefaultExpansion = commentsAreExpanded || !isMediumScreen || isMobile;
  const [expandedComments, setExpandedComments] = React.useState(hasDefaultExpansion);
  const [debouncedUri, setDebouncedUri] = React.useState();

  const totalFetchedComments = allCommentIds ? allCommentIds.length : 0;
  const channelSettings = channelId ? settingsByChannelId[channelId] : undefined;
  const moreBelow = page < topLevelTotalPages;
  const title = getCommentsListTitle(totalComments);
  const threadDepthLevel = isMobile ? 3 : 10;
  let threadCommentParent;
  if (threadCommentAncestors) {
    threadCommentAncestors.some((ancestor, index) => {
      if (index >= threadDepthLevel - 1) return true;

      threadCommentParent = ancestor;
    });
  }
  const threadTopLevelComment = threadCommentAncestors && threadCommentAncestors[threadCommentAncestors.length - 1];

  // Display comments immediately if not fetching reactions
  // If not, wait to show comments until reactions are fetched
  const [readyToDisplayComments, setReadyToDisplayComments] = React.useState(
    Boolean(othersReactsById) || !ENABLE_COMMENT_REACTIONS
  );

  // get commenter claim ids for checking premium status
  const commenterClaimIds = topLevelComments.map((comment) => comment.channel_id);

  // update premium status
  const shouldFetchUserMemberships = true;
  useGetUserMemberships(
    shouldFetchUserMemberships,
    commenterClaimIds,
    claimsByUri,
    doFetchUserMemberships,
    [topLevelComments],
    true
  );

  const handleReset = React.useCallback(() => {
    if (claimId) resetComments(claimId);
    setPage(1);
  }, [claimId, resetComments]);

  function refreshComments() {
    // Invalidate existing comments
    setPage(0);
  }

  function changeSort(newSort) {
    if (sort !== newSort) {
      setSort(newSort);
      refreshComments();
    }
  }

  // If a linked comment is deep within a thread, redirect to it's own thread page
  // based on the set depthLevel (mobile/desktop)
  React.useEffect(() => {
    if (
      !threadCommentId &&
      linkedCommentId &&
      linkedCommentAncestors &&
      linkedCommentAncestors.length > threadDepthLevel - 1 &&
      !threadRedirect.current
    ) {
      const urlParams = new URLSearchParams(search);
      urlParams.set(THREAD_COMMENT_QUERY_PARAM, linkedCommentId);

      push({ pathname, search: urlParams.toString() });
      // to do it only once
      threadRedirect.current = true;
    }
  }, [linkedCommentAncestors, linkedCommentId, pathname, push, search, threadCommentId, threadDepthLevel]);

  // set new page on scroll debounce and avoid setting the page after navigated uris
  useEffect(() => {
    if (debouncedUri && debouncedUri === uri) {
      setPage(page + 1);
      setDebouncedUri(undefined);
    }
    // only for comparing uri with debounced uri
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUri, uri]);

  // Force comments reset
  useEffect(() => {
    if (page === 0) {
      handleReset();
    }
  }, [handleReset, page]);

  // Set page back to 1 on every claim switch
  useEffect(() => {
    return () => setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  // When navigating to a new claim, the page will be 1 due to the above
  // and if there was already fetched top level comments, the fetched page will be higher
  // so set the current page as the fetched page to start fetching new pages from there
  useEffect(() => {
    if (page < currentFetchedPage) setPage(currentFetchedPage > 0 ? currentFetchedPage : 1);
    // only on uri change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  // Fetch top-level comments
  useEffect(() => {
    const isInitialFetch = currentFetchedPage === 0;
    const isNewPage = page !== 1 && page !== currentFetchedPage;
    // only one or the other should be true, if both are true it means
    // it will fetch the wrong page initially. needs Number so it's 0 or 1
    const hasRightFetchPage = Number(isInitialFetch) ^ Number(isNewPage);

    if (page !== 0 && hasRightFetchPage) {
      if (page === 1) {
        if (threadCommentId) {
          fetchComment(threadCommentId);
        }
        if (linkedCommentId) {
          fetchComment(linkedCommentId);
        }
      }

      fetchTopLevelComments(uri, undefined, page, COMMENT_PAGE_SIZE_TOP_LEVEL, sort);
    }
  }, [currentFetchedPage, fetchComment, fetchTopLevelComments, linkedCommentId, page, sort, threadCommentId, uri]);

  React.useEffect(() => {
    if (threadCommentId) {
      refreshComments();
    }
  }, [threadCommentId]);

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
    if (linkedCommentId || threadCommentId) {
      window.pendingLinkedCommentScroll = true;
    } else {
      delete window.pendingLinkedCommentScroll;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (topLevelComments.length === 0) return;

    function shouldFetchNextPage(page, topLevelTotalPages, yPrefetchPx = 1000) {
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
      if (shouldFetchNextPage(page, topLevelTotalPages)) {
        setDebouncedUri(uri);
        setInitialPageFetch(true);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (!didInitialPageFetch) {
      handleCommentScroll();
      setInitialPageFetch(true);
    }

    if (hasDefaultExpansion && !isFetchingComments && readyToDisplayComments && moreBelow) {
      const commentsInDrawer = Boolean(document.querySelector('.MuiDrawer-root .card--enable-overflow'));
      const scrollingElement = commentsInDrawer ? document.querySelector('.card--enable-overflow') : window;

      if (scrollingElement) {
        scrollingElement.addEventListener('scroll', handleCommentScroll);

        return () => scrollingElement.removeEventListener('scroll', handleCommentScroll);
      }
    }
  }, [
    topLevelComments,
    hasDefaultExpansion,
    didInitialPageFetch,
    isFetchingComments,
    isMobile,
    moreBelow,
    page,
    readyToDisplayComments,
    topLevelTotalPages,
    uri,
  ]);

  const commentProps = {
    isTopLevel: true,
    uri,
    claimIsMine,
    linkedCommentId,
    threadCommentId,
    threadDepthLevel,
  };
  const actionButtonsProps = {
    totalComments,
    sort,
    changeSort,
    handleRefresh: refreshComments,
  };

  return (
    <Card
      className="card--enable-overflow comment__list"
      title={(!isMobile || notInDrawer) && title}
      titleActions={<CommentActionButtons {...actionButtonsProps} />}
      actions={
        <>
          {isMobile && !notInDrawer && <CommentActionButtons {...actionButtonsProps} />}

          <CommentCreate uri={uri} />

          {threadCommentId && threadComment && (
            <span className="comment__actions comment__thread-links">
              <ThreadLinkButton
                label={__('View all comments')}
                threadCommentParent={threadTopLevelComment || threadCommentId}
                threadCommentId={threadCommentId}
                isViewAll
              />

              {threadCommentParent && (
                <ThreadLinkButton
                  label={__('Show parent comments')}
                  threadCommentParent={threadCommentParent}
                  threadCommentId={threadCommentId}
                />
              )}
            </span>
          )}

          {channelSettings &&
            channelSettings.comments_enabled &&
            !isFetchingComments &&
            !totalComments &&
            !threadCommentId && <Empty padded text={__('That was pretty deep. What do you think?')} />}

          <ul
            ref={commentListRef}
            className={classnames('comments', {
              'comments--contracted': isMediumScreen && !expandedComments && totalComments > 1,
            })}
          >
            {readyToDisplayComments && (
              <>
                {pinnedComments && !threadCommentId && <CommentElements comments={pinnedComments} {...commentProps} />}
                <CommentElements comments={topLevelComments} {...commentProps} />
              </>
            )}
          </ul>

          {!hasDefaultExpansion && (
            <div className="card__bottom-actions card__bottom-actions--comments">
              {(!expandedComments || moreBelow) && totalComments > 1 && (
                <Button
                  button="link"
                  title={!expandedComments ? __('Expand') : __('More')}
                  label={!expandedComments ? __('Expand') : __('More')}
                  onClick={() => (!expandedComments ? setExpandedComments(true) : setPage(page + 1))}
                />
              )}
              {expandedComments && totalComments > 1 && (
                <Button
                  button="link"
                  title={__('Collapse')}
                  label={__('Collapse')}
                  onClick={() => {
                    setExpandedComments(false);
                    if (commentListRef.current) {
                      const ADDITIONAL_OFFSET = 200;
                      const refTop = commentListRef.current.getBoundingClientRect().top;
                      window.scrollTo({
                        top: refTop + window.pageYOffset - ADDITIONAL_OFFSET,
                        behavior: 'smooth',
                      });
                    }
                  }}
                />
              )}
            </div>
          )}

          {(threadCommentId ? !readyToDisplayComments : isFetchingComments || (hasDefaultExpansion && moreBelow)) && (
            <div className="main--empty" ref={spinnerRef}>
              <Spinner type="small" />
            </div>
          )}
        </>
      }
    />
  );
}

type CommentProps = {
  comments: Array<Comment>,
};

const CommentElements = (commentProps: CommentProps) => {
  const { comments, ...commentsProps } = commentProps;

  return comments.map((comment) => <CommentView key={comment.comment_id} comment={comment} {...commentsProps} />);
};

type ActionButtonsProps = {
  totalComments: number,
  sort: string,
  changeSort: (string) => void,
  handleRefresh: () => void,
};

const CommentActionButtons = (actionButtonsProps: ActionButtonsProps) => {
  const { totalComments, sort, changeSort, handleRefresh } = actionButtonsProps;

  const sortButtonProps = { activeSort: sort, changeSort };

  return (
    <>
      {totalComments > 1 && ENABLE_COMMENT_REACTIONS && (
        <span className="comment__sort">
          <SortButton {...sortButtonProps} label={__('Best')} icon={ICONS.BEST} sortOption={SORT_BY.POPULARITY} />
          <SortButton
            {...sortButtonProps}
            label={__('Controversial')}
            icon={ICONS.CONTROVERSIAL}
            sortOption={SORT_BY.CONTROVERSY}
          />
          <SortButton {...sortButtonProps} label={__('New')} icon={ICONS.NEW} sortOption={SORT_BY.NEWEST} />
        </span>
      )}

      <Button button="alt" icon={ICONS.REFRESH} title={__('Refresh')} onClick={handleRefresh} />
    </>
  );
};

type SortButtonProps = {
  activeSort: string,
  sortOption: string,
  changeSort: (string) => void,
};

const SortButton = (sortButtonProps: SortButtonProps) => {
  const { activeSort, sortOption, changeSort, ...buttonProps } = sortButtonProps;

  return (
    <Button
      {...buttonProps}
      className={classnames(`button-toggle`, { 'button-toggle--active': activeSort === sortOption })}
      button="alt"
      iconSize={18}
      onClick={() => changeSort(sortOption)}
    />
  );
};

type ThreadLinkProps = {
  label: string,
  isViewAll?: boolean,
  threadCommentParent: string,
  threadCommentId: string,
};

const ThreadLinkButton = (props: ThreadLinkProps) => {
  const { label, isViewAll, threadCommentParent, threadCommentId } = props;

  const {
    push,
    location: { pathname, search },
  } = useHistory();

  return (
    <Button
      button="link"
      label={label}
      icon={ICONS.ARROW_LEFT}
      iconSize={12}
      onClick={() => {
        const urlParams = new URLSearchParams(search);

        if (!isViewAll) {
          urlParams.set(THREAD_COMMENT_QUERY_PARAM, threadCommentParent);
          // on moving back, link the current thread comment so that it auto-expands into the correct conversation
          urlParams.set(LINKED_COMMENT_QUERY_PARAM, threadCommentId);
        } else {
          urlParams.delete(THREAD_COMMENT_QUERY_PARAM);
          // links the top-level comment when going back to all comments, for easy locating
          // in the middle of big comment sections
          urlParams.set(LINKED_COMMENT_QUERY_PARAM, threadCommentParent);
        }
        window.pendingLinkedCommentScroll = true;

        push({ pathname, search: urlParams.toString() });
      }}
    />
  );
};
