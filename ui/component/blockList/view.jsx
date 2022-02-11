// @flow
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
// import '@reach/combobox/styles.css'; --> 'scss/third-party.scss'
import { matchSorter } from 'match-sorter';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import Icon from 'component/common/icon';
import Paginate from 'component/common/paginate';
import Yrbl from 'component/yrbl';
import * as ICONS from 'constants/icons';
import useThrottle from 'effects/use-throttle';

const PAGE_SIZE = 10;

function reduceUriToChannelName(uri: string) {
  // 'parseURI' is too slow to handle a large list. Since our list should be
  // kosher in the first place, just do a quick substring call. Add a
  // try-catch just in case.
  try {
    return uri.substring(uri.indexOf('@') + 1, uri.indexOf('#'));
  } catch {
    return uri;
  }
}

// ****************************************************************************
// BlockList
// ****************************************************************************

type Props = {
  uris: Array<string>,
  help: string,
  titleEmptyList: string,
  subtitleEmptyList: string,
  getActionButtons?: (url: string) => React$Node,
  className: ?string,
};

export default function BlockList(props: Props) {
  const { uris: list, help, titleEmptyList, subtitleEmptyList, getActionButtons, className } = props;

  // Keep a local list to allow for undoing actions in this component
  const [localList, setLocalList] = React.useState(undefined);
  const stringifiedList = JSON.stringify(list);
  const hasLocalList = localList && localList.length > 0;
  const justBlocked = list && localList && localList.length < list.length;

  const [page, setPage] = React.useState(1);
  const [searchList, setSearchList] = React.useState(null); // null: not searching; []: no results;
  const isShowingSearchResults = searchList !== null;

  let totalPages = 0;
  let paginatedLocalList;
  if (localList) {
    paginatedLocalList = localList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    totalPages = Math.ceil(localList.length / PAGE_SIZE);
  }

  // **************************************************************************
  // **************************************************************************

  function getRenderActions() {
    if (getActionButtons) {
      return (claim) => <div className="section__actions">{getActionButtons(claim.permanent_url)}</div>;
    }
    return undefined;
  }

  function formatSearchSuggestion(suggestion: string) {
    return reduceUriToChannelName(suggestion);
  }

  function filterSearchResults(results: ?Array<string>) {
    setSearchList(results);
  }

  // **************************************************************************
  // **************************************************************************

  React.useEffect(() => {
    const list = stringifiedList && JSON.parse(stringifiedList);
    if (!hasLocalList) {
      setLocalList(list && list.length > 0 ? list : []);
    }
  }, [stringifiedList, hasLocalList]);

  React.useEffect(() => {
    if (justBlocked && stringifiedList) {
      setLocalList(JSON.parse(stringifiedList));
    }
  }, [stringifiedList, justBlocked, setLocalList]);

  // **************************************************************************
  // **************************************************************************

  if (paginatedLocalList === undefined) {
    return null;
  }

  if (!hasLocalList) {
    return (
      <div className="main--empty">
        <Yrbl
          title={titleEmptyList}
          subtitle={subtitleEmptyList}
          actions={
            <div className="section__actions">
              <Button button="primary" label={__('Go Home')} navigate="/" />
            </div>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="help--notice">{help}</div>
      <div className="section" style={{ zIndex: '4' }}>
        <SearchList
          list={localList}
          placeholder={__('e.g. odysee')}
          formatter={formatSearchSuggestion}
          onResultsUpdated={filterSearchResults}
        />
      </div>
      <div className={classnames('section block-list', className)}>
        <ClaimList
          uris={searchList || paginatedLocalList}
          showUnresolvedClaims
          showHiddenByUser
          hideMenu
          renderActions={getRenderActions()}
        />
      </div>
      {!isShowingSearchResults && <Paginate totalPages={totalPages} disableHistory onPageChange={(p) => setPage(p)} />}
    </>
  );
}

// ****************************************************************************
// SearchList
// ****************************************************************************

type LsbProps = {
  list: ?Array<string>,
  placeholder?: string,
  formatter?: (suggestion: string) => string,
  onResultsUpdated?: (?Array<string>) => void,
};

function SearchList(props: LsbProps) {
  const { list, placeholder, formatter, onResultsUpdated } = props;
  const [term, setTerm] = React.useState('');
  const results = useAuthorMatch(term, list);
  const handleChange = (event) => setTerm(event.target.value);
  const handleSelect = (e) => setTerm(e);

  React.useEffect(() => {
    if (onResultsUpdated) {
      onResultsUpdated(results);
    }
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="wunderbar__wrapper">
      <label>{__('Search blocked channel name')}</label>
      <Combobox className="wunderbar" onSelect={handleSelect}>
        <Icon icon={ICONS.SEARCH} />
        <ComboboxInput selectOnClick className="wunderbar__input" onChange={handleChange} placeholder={placeholder} />
        {results && (
          <ComboboxPopover className="wunderbar__suggestions" portal={false}>
            {results.length > 0 ? (
              <ComboboxList>
                {results.slice(0, 10).map((result, index) => (
                  <ComboboxOption
                    className="wunderbar__more-results"
                    key={index}
                    value={formatter ? formatter(result) : result}
                  />
                ))}
              </ComboboxList>
            ) : (
              <span style={{ display: 'block', margin: 8 }}>{__('No results')}</span>
            )}
          </ComboboxPopover>
        )}
      </Combobox>
    </div>
  );
}

function useAuthorMatch(term, list) {
  const throttledTerm = useThrottle(term, 200);
  return React.useMemo(() => {
    return !throttledTerm || throttledTerm.trim() === ''
      ? null
      : matchSorter(list, throttledTerm, {
          keys: [(item) => reduceUriToChannelName(item)],
          threshold: matchSorter.rankings.CONTAINS,
        });
  }, [throttledTerm]); // eslint-disable-line react-hooks/exhaustive-deps
}
