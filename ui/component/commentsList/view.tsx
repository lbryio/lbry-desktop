import {COMMENT_PAGE_SIZE_TOP_LEVEL, SORT_BY} from 'constants/comment';
import { ENABLE_COMMENT_REACTIONS, COMMENT_SERVER_API, COMMENT_SERVER_NAME } from 'config';
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
import { FormField } from 'component/common/form';
import Comments from 'comments';

const DEBOUNCE_SCROLL_HANDLER_MS = 200;

function scaleToDevicePixelRatio(value: unknown) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  if (devicePixelRatio < 1.0) {
// @ts-expect-error - TS2362 - The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
    return Math.ceil(value / devicePixelRatio);
  }
// @ts-expect-error - TS2362 - The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  allCommentIds: any,
  pinnedComments: Array<LbryComment>,
  topLevelComments: Array<LbryComment>,
  resolvedComments: Array<LbryComment>,
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
  myReactsByCommentId: {
    [key: string]: Array<string>
  } | null | undefined // "CommentId:MyChannelId" -> reaction array (note the ID concatenation),
  othersReactsById: {
// @ts-expect-error - TS2749 - 'REACTION_TYPES.LIKE' refers to a value, but is being used as a type here. Did you mean 'typeof REACTION_TYPES.LIKE'? | TS2749 - 'REACTION_TYPES.DISLIKE' refers to a value, but is being used as a type here. Did you mean 'typeof REACTION_TYPES.DISLIKE'?
    [key: string]: Partial<Record<REACTION_TYPES.LIKE | REACTION_TYPES.DISLIKE, number>>
  } | null | undefined,
  activeChannelId: string | null | undefined,
  settingsByChannelId: {
    [channelId: string]: PerChannelSettings
  },
  commentsAreExpanded?: boolean,
  fetchTopLevelComments: (
    uri: string,
    parentId: string,
    page: number,
    pageSize: number,
    sortBy: number,
  ) => void,
  fetchComment: (commentId: string) => void,
  fetchReacts: (commentIds: Array<string>) => Promise<any>,
  resetComments: (claimId: string) => void,
  doResolveUris: (uris: Array<string>, returnCachedClaims: boolean) => void,
  customCommentServers: Array<CommentServerDetails>,
  setCommentServer: (arg1: string) => void,
  commentServer: string
};

export default function CommentList(props: Props) {
  const {
    allCommentIds,
    uri,
    pinnedComments,
    topLevelComments,
    resolvedComments,
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
    fetchTopLevelComments,
    fetchComment,
    fetchReacts,
    resetComments,
    doResolveUris,
    customCommentServers,
    setCommentServer,
    commentServer,
  } = props;

  const isMobile = useIsMobile();
  const isMediumScreen = useIsMediumScreen();

  const defaultServer = { name: COMMENT_SERVER_NAME, url: COMMENT_SERVER_API } as const;
  const allServers = [defaultServer, ...(customCommentServers || [])];

  const spinnerRef = React.useRef();
  const DEFAULT_SORT = ENABLE_COMMENT_REACTIONS ? SORT_BY.POPULARITY : SORT_BY.NEWEST;
  const [sort, setSort] = usePersistedState('comment-sort-by', DEFAULT_SORT);
  const [page, setPage] = React.useState(0);
  const [commentsToDisplay, setCommentsToDisplay] = React.useState(topLevelComments);
  const [didInitialPageFetch, setInitialPageFetch] = React.useState(false);
  const hasDefaultExpansion = commentsAreExpanded || !isMediumScreen || isMobile;
  const [expandedComments, setExpandedComments] = React.useState(hasDefaultExpansion);

  const totalFetchedComments = allCommentIds ? allCommentIds.length : 0;
  const channelSettings = channelId ? settingsByChannelId[channelId] : undefined;
  const moreBelow = page < topLevelTotalPages;
  const isResolvingComments = topLevelComments && resolvedComments.length !== topLevelComments.length;
  const alreadyResolved = !isResolvingComments && resolvedComments.length !== 0;
  const canDisplayComments = commentsToDisplay && commentsToDisplay.length === topLevelComments.length;
  const title = getCommentsListTitle(totalComments);

  // Display comments immediately if not fetching reactions
  // If not, wait to show comments until reactions are fetched
  const [readyToDisplayComments, setReadyToDisplayComments] = React.useState(
    Boolean(othersReactsById) || !ENABLE_COMMENT_REACTIONS
  );

  function changeSort(newSort: unknown) {
    if (sort !== newSort) {
      setSort(newSort);
      setPage(0); // Invalidate existing comments
    }
  }

  // Reset comments
  useEffect(() => {
    if (page === 0) {
      if (claimId) {
        resetComments(claimId);
      }
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

      fetchTopLevelComments(uri, '', page, COMMENT_PAGE_SIZE_TOP_LEVEL, sort);
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
// @ts-expect-error - TS2339 - Property 'pendingLinkedCommentScroll' does not exist on type 'Window & typeof globalThis'.
      window.pendingLinkedCommentScroll = true;
    } else {
// @ts-expect-error - TS2339 - Property 'pendingLinkedCommentScroll' does not exist on type 'Window & typeof globalThis'.
      delete window.pendingLinkedCommentScroll;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  useEffect(() => {
    function shouldFetchNextPage(page: unknown, topLevelTotalPages: unknown, yPrefetchPx = 1000) {
      if (!spinnerRef || !spinnerRef.current) return false;

// @ts-expect-error - TS2339 - Property 'getBoundingClientRect' does not exist on type 'never'.
      const rect = spinnerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      const windowW = window.innerWidth || document.documentElement.clientWidth;

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
        setPage(page + 1);
        setInitialPageFetch(true);
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (!didInitialPageFetch) {
      handleCommentScroll();
      setInitialPageFetch(true);
    }

    if (hasDefaultExpansion && !isFetchingComments && canDisplayComments && readyToDisplayComments && moreBelow) {
      const commentsInDrawer = Boolean(document.querySelector('.MuiDrawer-root .card--enable-overflow'));
      const scrollingElement = commentsInDrawer ? document.querySelector('.card--enable-overflow') : window;

      if (scrollingElement) {
        scrollingElement.addEventListener('scroll', handleCommentScroll);

        return () => scrollingElement.removeEventListener('scroll', handleCommentScroll);
      }
    }
  }, [
    canDisplayComments,
    hasDefaultExpansion,
    didInitialPageFetch,
    isFetchingComments,
    isMobile,
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

    const urisToResolve: unknown = [];
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
    topLevelComments.map(({ channel_url }) => channel_url !== undefined && urisToResolve.push(channel_url));

// @ts-expect-error - TS2339 - Property 'length' does not exist on type 'unknown'. | TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string[]'.
    if (urisToResolve.length > 0) doResolveUris(urisToResolve, true);
  }, [alreadyResolved, doResolveUris, topLevelComments]);

  const commentProps = { isTopLevel: true, threadDepth: 3, uri, claimIsMine, linkedCommentId } as const;
  const actionButtonsProps = {
    totalComments,
    sort,
    changeSort,
    setPage,
    allServers,
    commentServer,
    defaultServer,
    setCommentServer,
  } as const;

  return (
    <Card
      className="card--enable-overflow"
      title={!isMobile && title}
      titleActions={<CommentActionButtons {...actionButtonsProps} />}
      actions={
        <>
          {isMobile && <CommentActionButtons {...actionButtonsProps} />}

          {/* @ts-expect-error - TS2740 (ts-migration) */}
          <CommentCreate uri={uri} />

          {channelSettings && channelSettings.comments_enabled && !isFetchingComments && !totalComments && (
            <Empty padded text={__('That was pretty deep. What do you think?')} />
          )}

          <ul
            className={classnames({
              comments: !isMediumScreen || expandedComments,
              'comments--contracted': isMediumScreen && !expandedComments,
            })}
          >
            {readyToDisplayComments && (
              <>
{ /* @ts-expect-error - TS2786 - 'CommentElements' cannot be used as a JSX component. */}
                {pinnedComments && <CommentElements comments={pinnedComments} {...commentProps} />}

{ /* @ts-expect-error - TS2786 - 'CommentElements' cannot be used as a JSX component. */}
                {commentsToDisplay && <CommentElements comments={commentsToDisplay} {...commentProps} />}
              </>
            )}
          </ul>

          {!hasDefaultExpansion && (
            <div className="card__bottom-actions--comments">
              {(!expandedComments || moreBelow) && (
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="link"
                  title={!expandedComments ? __('Expand') : __('More')}
                  label={!expandedComments ? __('Expand') : __('More')}
                  onClick={() => (!expandedComments ? setExpandedComments(true) : setPage(page + 1))}
                />
              )}
              {expandedComments && (
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
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
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Spinner type="small" />
            </div>
          )}
        </>
      }
    />
  );
}

type CommentProps = {
  comments: Array<LbryComment>
};

const CommentElements = (commentProps: CommentProps) => {
  const { comments, ...commentsProps } = commentProps;

  // @ts-expect-error - TS2740 (ts-migration)
  return comments.map((comment) => <CommentView key={comment.comment_id} comment={comment} {...commentsProps} />);
};

type ActionButtonsProps = {
  totalComments: number,
  sort: string,
  changeSort: (arg1: string) => void,
  setPage: (arg1: number) => void,
  allServers: Array<CommentServerDetails>,
  commentServer: string,
  setCommentServer: (arg1: string) => void,
  defaultServer: CommentServerDetails
};

const CommentActionButtons = (actionButtonsProps: ActionButtonsProps) => {
  const { totalComments, sort, changeSort, setPage, allServers, commentServer, setCommentServer, defaultServer } =
    actionButtonsProps;
  const sortButtonProps = { activeSort: sort, changeSort } as const;

  return (
    <div className={'comment__actions-row'}>
      {totalComments > 1 && ENABLE_COMMENT_REACTIONS && (
        <div className="comment__sort-group">
{ /* @ts-expect-error - TS2322 - Type 'number' is not assignable to type 'string'. */}
          <SortButton {...sortButtonProps} label={__('Best')} icon={ICONS.BEST} sortOption={SORT_BY.POPULARITY} />
          <SortButton
            {...sortButtonProps}
            label={__('Controversial')}
            icon={ICONS.CONTROVERSIAL}
// @ts-expect-error - TS2322 - Type 'number' is not assignable to type 'string'.
            sortOption={SORT_BY.CONTROVERSY}
          />
{ /* @ts-expect-error - TS2322 - Type 'number' is not assignable to type 'string'. */}
          <SortButton {...sortButtonProps} label={__('New')} icon={ICONS.NEW} sortOption={SORT_BY.NEWEST} />
        </div>
      )}

      {allServers.length >= 2 && (
        <div className="button__selected-server">
{ /* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ children: Element[]; type: string; onChange: (x: any) => void; value: string; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
          <FormField
            type="select-tiny"
            onChange={function (x) {
              const selectedServer = x.target.value;
              setPage(0);
              setCommentServer(selectedServer);
              if (selectedServer === defaultServer.url) {
                Comments.setServerUrl(undefined);
              } else {
                Comments.setServerUrl(selectedServer);
              }
            }}
            value={commentServer}
          >
            {allServers.map(function (server) {
              return (
                <option key={server.url} value={server.url}>
                  {server.name}
                </option>
              );
            })}
          </FormField>
        </div>
      )}
      <div className="button_refresh">
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        <Button button="alt" icon={ICONS.REFRESH} title={__('Refresh')} onClick={() => setPage(0)} />
      </div>
    </div>
  );
};

type SortButtonProps = {
  activeSort: string,
  sortOption: string,
  changeSort: (arg1: string) => void
};

const SortButton = (sortButtonProps: SortButtonProps) => {
  const { activeSort, sortOption, changeSort, ...buttonProps } = sortButtonProps;

  return (
    <Button
      {...buttonProps}
      // @ts-expect-error - TS2322 (ts-migration)
      className={classnames(`button-toggle`, { 'button-toggle--active': activeSort === sortOption })}
      button="alt"
      iconSize={18}
      onClick={() => changeSort(sortOption)}
    />
  );
};
