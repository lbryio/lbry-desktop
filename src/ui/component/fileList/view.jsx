// @flow
import * as React from 'react';
import classnames from 'classnames';
import FileListItem from 'component/fileListItem';
import Spinner from 'component/spinner';
import { FormField } from 'component/common/form';
import usePersistedState from 'util/use-persisted-state';

const SORT_NEW = 'new';
const SORT_OLD = 'old';

type Props = {
  uris: Array<string>,
  header: React.Node,
  headerAltControls: React.Node,
  injectedItem?: React.Node,
  loading: boolean,
  noHeader?: boolean,
  slim?: string,
  empty?: string,
  // If using the default header, this is a unique ID needed to persist the state of the filter setting
  persistedStorageKey?: string,
};

export default function FileList(props: Props) {
  const { uris, header, headerAltControls, injectedItem, loading, persistedStorageKey, noHeader, slim, empty } = props;
  const [currentSort, setCurrentSort] = usePersistedState(persistedStorageKey || 'file-list-global-sort', SORT_NEW);
  const sortedUris = uris && currentSort === SORT_OLD ? uris.reverse() : uris;
  const hasUris = uris && !!uris.length;

  function handleSortChange() {
    setCurrentSort(currentSort === SORT_NEW ? SORT_OLD : SORT_NEW);
  }

  return (
    <section className={classnames('file-list')}>
      {!noHeader && (
        <div className="file-list__header">
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
      {!hasUris && !loading && (
        <div className="main--empty">{empty || <h3 className="card__title">{__('No results')}</h3>}</div>
      )}
    </section>
  );
}
