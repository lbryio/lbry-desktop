// @flow
import type { Node } from 'react';
import React from 'react';
import classnames from 'classnames';
import FileListItem from 'component/fileListItem';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import usePersistedState from 'util/use-persisted-state';

const SORT_NEW = 'new';
const SORT_OLD = 'old';

type Props = {
  uris: Array<string>,
  header: Node,
  headerAltControls: Node,
  injectedItem?: Node,
  loading: boolean,
  noHeader?: boolean,
  slim?: string,
  empty?: string,
  meta?: Node,
  // If using the default header, this is a unique ID needed to persist the state of the filter setting
  persistedStorageKey?: string,
};

export default function FileList(props: Props) {
  const {
    uris,
    header,
    headerAltControls,
    injectedItem,
    loading,
    persistedStorageKey,
    noHeader,
    slim,
    empty,
    meta,
  } = props;
  const [currentSort, setCurrentSort] = usePersistedState(persistedStorageKey, SORT_NEW);
  const sortedUris = uris && currentSort === SORT_OLD ? uris.reverse() : uris;
  const hasUris = uris && !!uris.length;

  function handleSortChange() {
    setCurrentSort(currentSort === SORT_NEW ? SORT_OLD : SORT_NEW);
  }

  return (
    <section className={classnames('file-list')}>
      {!noHeader && (
        <div className={classnames('file-list__header', { 'file-list__header--slim': slim })}>
          {header || (
            <FormField
              className="file-list__dropdown"
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
          <div className="file-list__alt-controls">{headerAltControls}</div>
        </div>
      )}
      {meta && <div className="file-list__meta">{meta}</div>}
      {hasUris && (
        <ul>
          {sortedUris.map((uri, index) => (
            <React.Fragment key={uri}>
              <FileListItem uri={uri} slim={slim} />
              {index === 4 && injectedItem && <li className="file-list__item--injected">{injectedItem}</li>}
            </React.Fragment>
          ))}
        </ul>
      )}
      {!hasUris && !loading && <h2 className="main--empty empty">{empty || __('No results')}</h2>}
    </section>
  );
}
