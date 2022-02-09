// @flow
import React from 'react';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import ClaimPreview from 'component/claimPreview';
import Card from 'component/common/card';
import Empty from 'component/common/empty';
import Page from 'component/page';
import Spinner from 'component/spinner';
import { COMMENT_PAGE_SIZE_TOP_LEVEL } from 'constants/comment';
import * as ICONS from 'constants/icons';
import useFetched from 'effects/use-fetched';
import debounce from 'util/debounce';
import { lazyImport } from 'util/lazyImport';

const Comment = lazyImport(() => import('component/comment' /* webpackChunkName: "comments" */));

function scaleToDevicePixelRatio(value) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  if (devicePixelRatio < 1.0) {
    return Math.ceil(value / devicePixelRatio);
  }
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  activeChannelClaim: ?ChannelClaim,
  allComments: Array<Comment>,
  totalComments: number,
  topLevelTotalPages: number,
  isFetchingComments: boolean,
  claimsById: any,
  doCommentReset: (claimId: string) => void,
  doCommentListOwn: (channelId: string, page: number, pageSize: number) => void,
};

export default function OwnComments(props: Props) {
  const {
    activeChannelClaim,
    allComments,
    totalComments,
    isFetchingComments,
    claimsById,
    doCommentReset,
    doCommentListOwn,
  } = props;
  const spinnerRef = React.useRef();
  const [page, setPage] = React.useState(0);
  const [activeChannelId, setActiveChannelId] = React.useState('');

  // Since we are sharing the key for Discussion and MyComments, don't show
  // the list until we've gone through the initial reset.
  const wasResetAndReady = useFetched(isFetchingComments);

  const totalPages = Math.ceil(totalComments / COMMENT_PAGE_SIZE_TOP_LEVEL);
  const moreBelow = page < totalPages;

  function getCommentsElem(comments) {
    return comments.map((comment) => {
      const contentClaim = claimsById[comment.claim_id];
      const isChannel = contentClaim && contentClaim.value_type === 'channel';
      const isLivestream = Boolean(contentClaim && contentClaim.value_type === 'stream' && !contentClaim.value.source);

      return (
        <div key={comment.comment_id} className="comments-own card__main-actions">
          <div className="section__actions">
            <div className="comments-own--claim">
              {contentClaim && (
                <ClaimPreview
                  uri={contentClaim.canonical_url}
                  searchParams={{
                    ...(isChannel ? { view: 'discussion' } : {}),
                    ...(isLivestream ? {} : { lc: comment.comment_id }),
                  }}
                  hideActions
                  hideMenu
                  properties={() => null}
                />
              )}
              {!contentClaim && <Empty text={__('Content or channel was deleted.')} />}
            </div>
            <React.Suspense fallback={null}>
              <Comment
                isTopLevel
                hideActions
                comment={comment}
                commentIsMine
                numDirectReplies={0} // Don't show replies here
              />
            </React.Suspense>
          </div>
        </div>
      );
    });
  }

  // Active channel changed
  React.useEffect(() => {
    if (activeChannelClaim && activeChannelClaim.claim_id !== activeChannelId) {
      setActiveChannelId(activeChannelClaim.claim_id);
      setPage(0);
    }
  }, [activeChannelClaim, activeChannelId]);

  // Reset comments
  React.useEffect(() => {
    if (page === 0 && activeChannelId) {
      doCommentReset(activeChannelId);
      setPage(1);
    }
  }, [page, activeChannelId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch own comments
  React.useEffect(() => {
    if (page !== 0 && activeChannelId) {
      doCommentListOwn(activeChannelId, page, COMMENT_PAGE_SIZE_TOP_LEVEL);
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  React.useEffect(() => {
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
      if (shouldFetchNextPage(page, totalPages, window, document)) {
        setPage(page + 1);
      }
    }, 200);

    if (!isFetchingComments && moreBelow && spinnerRef && spinnerRef.current) {
      if (shouldFetchNextPage(page, totalPages, window, document, 0)) {
        setPage(page + 1);
      } else {
        window.addEventListener('scroll', handleCommentScroll);
        return () => window.removeEventListener('scroll', handleCommentScroll);
      }
    }
  }, [page, spinnerRef, isFetchingComments, moreBelow, totalPages]);

  // **************************************************************************
  // **************************************************************************

  if (!activeChannelClaim) {
    return null;
  }

  return (
    <Page noFooter noSideNavigation settingsPage backout={{ title: __('Your comments'), backLabel: __('Back') }}>
      <ChannelSelector hideAnon />
      <Card
        isBodyList
        title={
          totalComments > 0
            ? totalComments === 1
              ? __('1 comment')
              : __('%total_comments% comments', { total_comments: totalComments })
            : isFetchingComments
            ? ''
            : __('No comments')
        }
        titleActions={
          <Button
            button="alt"
            icon={ICONS.REFRESH}
            title={__('Refresh')}
            onClick={() => {
              setPage(0);
            }}
          />
        }
        body={
          <>
            {wasResetAndReady && <ul className="comments">{allComments && getCommentsElem(allComments)}</ul>}
            {(isFetchingComments || moreBelow) && (
              <div className="main--empty" ref={spinnerRef}>
                <Spinner type="small" />
              </div>
            )}
          </>
        }
      />
    </Page>
  );
}
