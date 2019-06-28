// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import ClaimPreview from 'component/claimPreview';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import usePersistedState from 'util/use-persisted-state';

const SORT_NEW = 'new';
const SORT_OLD = 'old';

type Props = {
  uris: Array<string>,
  header: Node | boolean,
  headerAltControls: Node,
  injectedItem?: Node,
  loading: boolean,
  type: string,
  empty?: string,
  meta?: Node,
  // If using the default header, this is a unique ID needed to persist the state of the filter setting
  persistedStorageKey?: string,
};

export default function ClaimList(props: Props) {
  const { uris, headerAltControls, injectedItem, loading, persistedStorageKey, empty, meta, type, header } = props;
  const [currentSort, setCurrentSort] = usePersistedState(persistedStorageKey, SORT_NEW);
  const hasUris = uris && !!uris.length;
  const sortedUris = (hasUris && (currentSort === SORT_NEW ? uris : uris.slice().reverse())) || [];

  function handleSortChange() {
    setCurrentSort(currentSort === SORT_NEW ? SORT_OLD : SORT_NEW);
  }

  return (
    <section className={classnames('file-list')}>
      {header !== false && (
        <div className={classnames('claim-list__header', { 'claim-list__header--small': type === 'small' })}>
          {header || (
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
          {loading && <Spinner light type="small" />}
          <div className="claim-list__alt-controls">{headerAltControls}</div>
        </div>
      )}
      {meta && <div className="claim-list__meta">{meta}</div>}
      {hasUris && (
        <ul>
          {sortedUris.map((uri, index) => (
            <React.Fragment key={uri}>
              <ClaimPreview uri={uri} type={type} />
              {index === 4 && injectedItem && <li className="claim-list__item--injected">{injectedItem}</li>}
            </React.Fragment>
          ))}
        </ul>
      )}
      {!hasUris && !loading && <h2 className="main--empty empty">{empty || __('No results')}</h2>}
    </section>
  );
}
