// @flow
/**
 * Infinite-scroll and batch-resolving handling for `claimList` instances.
 *
 * By default, the list is "locked" during initial mount to have a stable
 * pagination, but can be disabled through the `disableListLock` parameter.
 */

import React from 'react';

export default function useClaimListInfiniteScroll(
  allUris: Array<string>,
  doResolveUris: (uris: Array<string>, returnCachedClaims: boolean, resolveReposts: boolean) => void,
  pageSize: number = 30,
  disableListLock: boolean = false
) {
  // Lock the full set of uris on mount, so we have a stable list for pagination.
  const [uris, setUris] = React.useState([]);

  // Infinite-scroll handling. 'page' is 0-indexed.
  const [page, setPage] = React.useState(-1);
  const lastPage = Math.max(0, Math.ceil(allUris.length / pageSize) - 1);
  const [isLoadingPage, setIsLoadingPage] = React.useState(true);

  async function resolveUris(uris) {
    return doResolveUris(uris, true, false);
  }

  async function resolveNextPage(uris, currPage, pageSize) {
    const nextPage = currPage + 1;
    const nextUriBatch = uris.slice(nextPage * pageSize, (nextPage + 1) * pageSize);
    return resolveUris(nextUriBatch);
  }

  function bumpPage() {
    if (page < lastPage) {
      setIsLoadingPage(true);
      resolveNextPage(uris, page, pageSize).finally(() => {
        setIsLoadingPage(false);
        setPage(page + 1);
      });
    }
  }

  // -- Initial mount: lock list and resolve first batch:
  React.useEffect(() => {
    setUris(allUris);
    resolveNextPage(allUris, -1, pageSize).finally(() => {
      setIsLoadingPage(false);
      setPage(0);
    });
  }, []);

  // -- Optional: remove the locking behavior for whatever reason:
  React.useEffect(() => {
    if (disableListLock) {
      setUris(allUris);
    }
  }, [allUris]);

  return { uris, page, isLoadingPage, bumpPage };
}
