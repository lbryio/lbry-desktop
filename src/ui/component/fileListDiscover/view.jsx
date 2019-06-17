// @flow
import type { Node } from 'react';
import React, { useEffect } from 'react';
import moment from 'moment';
import { FormField } from 'component/common/form';
import FileList from 'component/fileList';
import Tag from 'component/tag';
import usePersistedState from 'util/use-persisted-state';

const TIME_DAY = 'day';
const TIME_WEEK = 'week';
const TIME_MONTH = 'month';
const TIME_YEAR = 'year';
const TIME_ALL = 'all';
const SEARCH_SORT_YOU = 'you';
const SEARCH_SORT_ALL = 'everyone';
const TYPE_TRENDING = 'trending';
const TYPE_TOP = 'top';
const TYPE_NEW = 'new';
const SEARCH_FILTER_TYPES = [SEARCH_SORT_YOU, SEARCH_SORT_ALL];
const SEARCH_TYPES = ['trending', 'top', 'new'];
const SEARCH_TIMES = [TIME_DAY, TIME_WEEK, TIME_MONTH, TIME_YEAR, TIME_ALL];

type Props = {
  uris: Array<string>,
  doClaimSearch: (number, {}) => void,
  injectedItem: any,
  tags: Array<string>,
  loading: boolean,
  personal: boolean,
  doToggleTagFollow: string => void,
  meta?: Node,
};

function FileListDiscover(props: Props) {
  const { doClaimSearch, uris, tags, loading, personal, injectedItem, meta } = props;
  const [personalSort, setPersonalSort] = usePersistedState('file-list-trending:personalSort', SEARCH_SORT_YOU);
  const [typeSort, setTypeSort] = usePersistedState('file-list-trending:typeSort', TYPE_TRENDING);
  const [timeSort, setTimeSort] = usePersistedState('file-list-trending:timeSort', TIME_WEEK);

  const toCapitalCase = string => string.charAt(0).toUpperCase() + string.slice(1);
  const tagsString = tags.join(',');
  useEffect(() => {
    const options = {};
    const newTags = tagsString.split(',');

    if ((newTags && !personal) || (newTags && personal && personalSort === SEARCH_SORT_YOU)) {
      options.any_tags = newTags;
    }

    if (typeSort === TYPE_TRENDING) {
      options.order_by = ['trending_global', 'trending_mixed'];
    } else if (typeSort === TYPE_NEW) {
      options.order_by = ['release_time'];
    } else if (typeSort === TYPE_TOP) {
      options.order_by = ['effective_amount'];
      if (timeSort !== TIME_ALL) {
        const time = Math.floor(
          moment()
            .subtract(1, timeSort)
            .unix()
        );
        options.release_time = `>${time}`;
      }
    }

    doClaimSearch(20, options);
  }, [personal, personalSort, typeSort, timeSort, doClaimSearch, tagsString]);

  const header = (
    <h1 className="card__title--flex">
      <FormField
        className="file-list__dropdown"
        type="select"
        name="trending_sort"
        value={typeSort}
        onChange={e => setTypeSort(e.target.value)}
      >
        {SEARCH_TYPES.map(type => (
          <option key={type} value={type}>
            {toCapitalCase(type)}
          </option>
        ))}
      </FormField>
      <span>{__('For')}</span>
      {!personal && tags && tags.length ? (
        tags.map(tag => <Tag key={tag} name={tag} disabled />)
      ) : (
        <FormField
          type="select"
          name="trending_overview"
          className="file-list__dropdown"
          value={personalSort}
          onChange={e => setPersonalSort(e.target.value)}
        >
          {SEARCH_FILTER_TYPES.map(type => (
            <option key={type} value={type}>
              {toCapitalCase(type)}
            </option>
          ))}
        </FormField>
      )}
    </h1>
  );

  const headerAltControls = (
    <React.Fragment>
      {typeSort === 'top' && (
        <FormField
          className="file-list__dropdown"
          type="select"
          name="trending_time"
          value={timeSort}
          onChange={e => setTimeSort(e.target.value)}
        >
          {SEARCH_TIMES.map(time => (
            <option key={time} value={time}>
              {toCapitalCase(time)}
            </option>
          ))}
        </FormField>
      )}
    </React.Fragment>
  );

  return (
    <div className="card">
      <FileList
        meta={meta}
        loading={loading}
        uris={uris}
        injectedItem={personalSort === SEARCH_SORT_YOU && injectedItem}
        header={header}
        headerAltControls={headerAltControls}
      />
    </div>
  );
}

export default FileListDiscover;
