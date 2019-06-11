// @flow
import React, { useEffect } from 'react';
import { FormField } from 'component/common/form';
import FileList from 'component/fileList';
import moment from 'moment';
import usePersistedState from 'util/use-persisted-state';

const TIME_DAY = 'day';
const TIME_WEEK = 'week';
const TIME_MONTH = 'month';
const TIME_YEAR = 'year';
const TIME_ALL = 'all';
const TRENDING_SORT_YOU = 'you';
const TRENDING_SORT_ALL = 'everyone';
const TYPE_TRENDING = 'trending';
const TYPE_TOP = 'top';
const TYPE_NEW = 'new';
const TRENDING_FILTER_TYPES = [TRENDING_SORT_YOU, TRENDING_SORT_ALL];
const TRENDING_TYPES = ['trending', 'top', 'new'];
const TRENDING_TIMES = [TIME_DAY, TIME_WEEK, TIME_MONTH, TIME_YEAR, TIME_ALL];

type Props = {
  uris: Array<string>,
  doClaimSearch: (number, {}) => void,
  injectedItem: any,
  tags: Array<string>,
  loading: boolean,
  personal: boolean,
};

function FileListDiscover(props: Props) {
  const { doClaimSearch, uris, tags, loading, personal, injectedItem } = props;
  const [personalSort, setPersonalSort] = usePersistedState('file-list-trending:personalSort', TRENDING_SORT_YOU);
  const [typeSort, setTypeSort] = usePersistedState('file-list-trending:typeSort', TYPE_TRENDING);
  const [timeSort, setTimeSort] = usePersistedState('file-list-trending:timeSort', TIME_WEEK);

  const toCapitalCase = string => string.charAt(0).toUpperCase() + string.slice(1);
  const tagsString = tags.join(',');
  useEffect(() => {
    const options = {};
    const newTags = tagsString.split(',');

    if (personalSort === TRENDING_SORT_YOU) {
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
  }, [personalSort, typeSort, timeSort, doClaimSearch, tagsString]);

  const header = (
    <React.Fragment>
      <h1 className={`card__title--flex`}>
        {toCapitalCase(typeSort)} {'For'}
      </h1>
      {!personal && tags && tags.length ? (
        tags.map(tag => (
          <span key={tag} className="tag tag--remove" disabled>
            {tag}
          </span>
        ))
      ) : (
        <FormField
          type="select"
          name="trending_overview"
          className="file-list__dropdown"
          value={personalSort}
          onChange={e => setPersonalSort(e.target.value)}
        >
          {TRENDING_FILTER_TYPES.map(type => (
            <option key={type} value={type}>
              {toCapitalCase(type)}
            </option>
          ))}
        </FormField>
      )}
    </React.Fragment>
  );

  const headerAltControls = (
    <React.Fragment>
      <FormField
        className="file-list__dropdown"
        type="select"
        name="trending_sort"
        value={typeSort}
        onChange={e => setTypeSort(e.target.value)}
      >
        {TRENDING_TYPES.map(type => (
          <option key={type} value={type}>
            {toCapitalCase(type)}
          </option>
        ))}
      </FormField>
      {typeSort === 'top' && (
        <FormField
          className="file-list__dropdown"
          type="select"
          name="trending_time"
          value={timeSort}
          onChange={e => setTimeSort(e.target.value)}
        >
          {TRENDING_TIMES.map(time => (
            <option key={time} value={time}>
              {toCapitalCase(time)}
            </option>
          ))}
        </FormField>
      )}
    </React.Fragment>
  );

  return (
    <FileList
      loading={loading}
      uris={uris}
      injectedItem={personalSort === TRENDING_SORT_YOU && injectedItem}
      header={header}
      headerAltControls={headerAltControls}
    />
  );
}

export default FileListDiscover;
