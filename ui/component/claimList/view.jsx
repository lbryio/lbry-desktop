// @flow
import { MAIN_WRAPPER_CLASS } from 'component/app/view';
import { MAIN_CLASS } from 'component/page/view';
import type { Node } from 'react';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import ClaimPreview from 'component/claimPreview';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';

const SORT_NEW = 'new';
const SORT_OLD = 'old';
const PADDING_ALLOWANCE = 100;

type Props = {
  uris: Array<string>,
  header: Node | boolean,
  headerAltControls: Node,
  loading: boolean,
  type: string,
  empty?: string,
  defaultSort?: boolean,
  onScrollBottom?: any => void,
  page?: number,
  pageSize?: number,
  id?: string,
  // If using the default header, this is a unique ID needed to persist the state of the filter setting
  persistedStorageKey?: string,
  showHiddenByUser: boolean,
  headerLabel?: string | Node,
  showUnresolvedClaims?: boolean,
  renderProperties: ?(Claim) => Node,
  includeSupportAction?: boolean,
};

export default function ClaimList(props: Props) {
  const {
    uris,
    headerAltControls,
    loading,
    persistedStorageKey,
    empty,
    defaultSort,
    type,
    header,
    onScrollBottom,
    pageSize,
    page,
    id,
    showHiddenByUser,
    headerLabel,
    showUnresolvedClaims,
    renderProperties,
    includeSupportAction,
  } = props;
  const [scrollBottomCbMap, setScrollBottomCbMap] = useState({});
  const [currentSort, setCurrentSort] = usePersistedState(persistedStorageKey, SORT_NEW);
  const urisLength = (uris && uris.length) || 0;
  const sortedUris = (urisLength > 0 && (currentSort === SORT_NEW ? uris : uris.slice().reverse())) || [];

  function handleSortChange() {
    setCurrentSort(currentSort === SORT_NEW ? SORT_OLD : SORT_NEW);
  }

  useEffect(() => {
    setScrollBottomCbMap({});
  }, [id, setScrollBottomCbMap]);

  useEffect(() => {
    function handleScroll(e) {
      if (page && pageSize && onScrollBottom && !scrollBottomCbMap[page]) {
        const x = document.querySelector(`.${MAIN_WRAPPER_CLASS}`);
        const mc = document.querySelector(`.${MAIN_CLASS}`);

        if (
          x &&
          mc &&
          (window.scrollY + window.innerHeight >= x.offsetHeight ||
            x.offsetHeight - mc.offsetHeight > PADDING_ALLOWANCE) &&
          !loading &&
          urisLength >= pageSize
        ) {
          onScrollBottom();

          // Save that we've fetched this page to avoid weird stuff happening with fast scrolling
          setScrollBottomCbMap({ ...scrollBottomCbMap, [page]: true });
        }
      }
    }

    if (onScrollBottom) {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [loading, onScrollBottom, urisLength, pageSize, page, setScrollBottomCbMap]);

  return (
    <section
      className={classnames('claim-list', {
        'claim-list--small': type === 'small',
      })}
    >
      {header !== false && (
        <React.Fragment>
          {headerLabel && <label className="claim-list__header-label">{headerLabel}</label>}
          <div className={classnames('claim-list__header', { 'section__title--small': type === 'small' })}>
            {header}
            {loading && <Spinner type="small" />}
            <div className="claim-list__alt-controls">
              {headerAltControls}
              {defaultSort && (
                <FormField
                  className="claim-list__dropdown"
                  type="select"
                  name="file_sort"
                  value={currentSort}
                  onChange={handleSortChange}
                >
                  <option value={SORT_NEW}>{__('Newest First')}</option>
                  <option value={SORT_OLD}>{__('Oldest First')}</option>
                </FormField>
              )}
            </div>
          </div>
        </React.Fragment>
      )}

      {urisLength > 0 && (
        <ul className="card ul--no-style">
          {sortedUris.map((uri, index) => (
            <ClaimPreview
              key={uri}
              uri={uri}
              type={type}
              includeSupportAction={includeSupportAction}
              showUnresolvedClaim={showUnresolvedClaims}
              properties={renderProperties || (type !== 'small' ? undefined : false)}
              showUserBlocked={showHiddenByUser}
              customShouldHide={(claim: StreamClaim) => {
                // Hack to hide spee.ch thumbnail publishes
                // If it meets these requirements, it was probably uploaded here:
                // https://github.com/lbryio/lbry-redux/blob/master/src/redux/actions/publish.js#L74-L79
                if (claim.name.length === 24 && !claim.name.includes(' ') && claim.value.author === 'Spee.ch') {
                  return true;
                } else {
                  return false;
                }
              }}
            />
          ))}
        </ul>
      )}
      {urisLength === 0 && !loading && (
        <div className="card--section main--empty empty">{empty || __('No results')}</div>
      )}
    </section>
  );
}
