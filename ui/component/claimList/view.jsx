// @flow
import { MAIN_WRAPPER_CLASS } from 'component/app/view';
import type { Node } from 'react';
import React, { useEffect } from 'react';
import classnames from 'classnames';
import ClaimPreview from 'component/claimPreview';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
import debounce from 'util/debounce';

const DEBOUNCE_SCROLL_HANDLER_MS = 150;
const SORT_NEW = 'new';
const SORT_OLD = 'old';

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
  showUnresolvedClaims?: boolean,
  renderProperties: ?(Claim) => Node,
  includeSupportAction?: boolean,
  hideBlock: boolean,
  injectedItem: ?Node,
  timedOutMessage?: Node,
  isCardBody?: boolean,
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
    showHiddenByUser,
    showUnresolvedClaims,
    renderProperties,
    includeSupportAction,
    hideBlock,
    injectedItem,
    timedOutMessage,
    isCardBody = false,
  } = props;
  const [currentSort, setCurrentSort] = usePersistedState(persistedStorageKey, SORT_NEW);
  const timedOut = uris === null;
  const urisLength = (uris && uris.length) || 0;
  const sortedUris = (urisLength > 0 && (currentSort === SORT_NEW ? uris : uris.slice().reverse())) || [];

  function handleSortChange() {
    setCurrentSort(currentSort === SORT_NEW ? SORT_OLD : SORT_NEW);
  }

  useEffect(() => {
    const handleScroll = debounce(e => {
      if (page && pageSize && onScrollBottom) {
        const mainElWrapper = document.querySelector(`.${MAIN_WRAPPER_CLASS}`);

        if (mainElWrapper && !loading && urisLength >= pageSize) {
          const contentWrapperAtBottomOfPage = mainElWrapper.getBoundingClientRect().bottom - 0.5 <= window.innerHeight;

          if (contentWrapperAtBottomOfPage) {
            onScrollBottom();
          }
        }
      }
    }, DEBOUNCE_SCROLL_HANDLER_MS);

    if (onScrollBottom) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [loading, onScrollBottom, urisLength, pageSize, page]);

  return (
    <section
      className={classnames('claim-list', {
        'claim-list--small': type === 'small',
      })}
    >
      {header !== false && (
        <React.Fragment>
          {header && (
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
          )}
        </React.Fragment>
      )}

      {urisLength > 0 && (
        <ul
          className={classnames('ul--no-style', {
            card: !isCardBody,
            'claim-list--card-body': isCardBody,
          })}
        >
          {sortedUris.map((uri, index) => (
            <React.Fragment key={uri}>
              {injectedItem && index === 4 && <li>{injectedItem}</li>}
              <ClaimPreview
                uri={uri}
                type={type}
                includeSupportAction={includeSupportAction}
                showUnresolvedClaim={showUnresolvedClaims}
                properties={renderProperties || (type !== 'small' ? undefined : false)}
                showUserBlocked={showHiddenByUser}
                hideBlock={hideBlock}
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
            </React.Fragment>
          ))}
        </ul>
      )}
      {!timedOut && urisLength === 0 && !loading && (
        <div className="empty empty--centered">{empty || __('No results')}</div>
      )}
      {timedOut && timedOutMessage && <div className="empty empty--centered">{timedOutMessage}</div>}
    </section>
  );
}
