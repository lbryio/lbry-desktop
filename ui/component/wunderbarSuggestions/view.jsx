// @flow
import { URL, URL_LOCAL, URL_DEV, KNOWN_APP_DOMAINS } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import useLighthouse from 'effects/use-lighthouse';
import { Form } from 'component/common/form';
import Button from 'component/button';
import WunderbarTopSuggestion from 'component/wunderbarTopSuggestion';
import WunderbarSuggestion from 'component/wunderbarSuggestion';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';
import useThrottle from 'effects/use-throttle';
import Yrbl from 'component/yrbl';
import type { ElementRef } from 'react';

const LBRY_PROTOCOL = 'lbry://';
const WEB_DEV_PREFIX = `${URL_DEV}/`;
const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
const WEB_PROD_PREFIX = `${URL}/`;
const SEARCH_PREFIX = `$/${PAGES.SEARCH}q=`;
const INVALID_URL_ERROR = "Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and '-' allowed.";

const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;

type Props = {
  searchQuery: ?string,
  onSearch: (string) => void,
  navigateToSearchPage: (string) => void,
  doResolveUris: (string) => void,
  doShowSnackBar: (string) => void,
  showMature: boolean,
  isMobile: boolean,
  doCloseMobileSearch: () => void,
};

export default function WunderBarSuggestions(props: Props) {
  const { navigateToSearchPage, doShowSnackBar, doResolveUris, showMature, isMobile, doCloseMobileSearch } = props;
  const inputRef: ElementRef<any> = React.useRef();
  const isFocused = inputRef && inputRef.current && inputRef.current === document.activeElement;

  const {
    push,
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const queryFromUrl = urlParams.get('q') || '';
  const [term, setTerm] = React.useState(queryFromUrl);
  const throttledTerm = useThrottle(term, 500) || '';
  const searchSize = isMobile ? 20 : 5;
  const { results, loading } = useLighthouse(throttledTerm, showMature, searchSize);
  const noResults = throttledTerm && !loading && results && results.length === 0;
  const nameFromQuery = throttledTerm.trim().replace(/\s+/g, '').replace(/:/g, '#');
  const uriFromQuery = `lbry://${nameFromQuery}`;
  let uriFromQueryIsValid = false;
  let channelUrlForTopTest;
  try {
    const { isChannel } = parseURI(uriFromQuery);
    uriFromQueryIsValid = true;
    if (!isChannel) {
      channelUrlForTopTest = `lbry://@${uriFromQuery}`;
    }
  } catch (e) {}

  const topUrisToTest = [uriFromQuery];
  if (channelUrlForTopTest) {
    topUrisToTest.push(uriFromQuery);
  }

  function handleSelect(value) {
    if (!value) {
      return;
    }

    doCloseMobileSearch();

    const knownAppDomains = KNOWN_APP_DOMAINS.map((x) => `https://${x}/`); // Match WEB_PROD_PREFIX's 'https://xx/' format.
    const webDomainList = [WEB_PROD_PREFIX, ...knownAppDomains, WEB_LOCAL_PREFIX, WEB_DEV_PREFIX];
    const webDomainIndex = webDomainList.findIndex((x) => value.includes(x));
    const wasCopiedFromWeb = webDomainIndex !== -1;
    const isLbryUrl = value.startsWith('lbry://');

    if (inputRef.current) {
      inputRef.current.blur();
    }

    if (wasCopiedFromWeb) {
      const prefix = webDomainList[webDomainIndex];
      let query = value.slice(prefix.length).replace(/:/g, '#');

      if (query.includes(SEARCH_PREFIX)) {
        query = query.slice(SEARCH_PREFIX.length);
        navigateToSearchPage(query);
      } else {
        try {
          const lbryUrl = `lbry://${query}`;
          parseURI(lbryUrl);
          const formattedLbryUrl = formatLbryUrlForWeb(lbryUrl);
          push(formattedLbryUrl);

          return;
        } catch (e) {}
      }
    }

    if (!isLbryUrl) {
      navigateToSearchPage(value);
    } else {
      let query = 'lbry://' + value.slice(LBRY_PROTOCOL.length).replace(/:/g, '#');
      try {
        if (isURIValid(query)) {
          const uri = normalizeURI(query);
          const normalizedWebUrl = formatLbryUrlForWeb(uri);
          push(normalizedWebUrl);
        } else {
          doShowSnackBar(INVALID_URL_ERROR);
        }
      } catch (e) {
        navigateToSearchPage(value);
      }
    }
  }

  React.useEffect(() => {
    function handleKeyDown(event) {
      const { ctrlKey, metaKey, keyCode } = event;

      if (!inputRef.current) {
        return;
      }

      if (inputRef.current === document.activeElement && keyCode === ESC_KEY_CODE) {
        inputRef.current.blur();
      }

      // @if TARGET='app'
      const shouldFocus =
        process.platform === 'darwin' ? keyCode === L_KEY_CODE && metaKey : keyCode === L_KEY_CODE && ctrlKey;
      if (shouldFocus) {
        inputRef.current.focus();
      }
      // @endif
    }

    window.addEventListener('keydown', handleKeyDown);

    // @if TARGET='app'
    function handleDoubleClick(event) {
      if (!inputRef.current) {
        return;
      }

      event.stopPropagation();
    }

    inputRef.current.addEventListener('dblclick', handleDoubleClick);
    // @endif

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // @if TARGET='app'
      if (inputRef.current) {
        inputRef.current.removeEventListener('dblclick', handleDoubleClick);
      }
      // @endif
    };
  }, [inputRef]);

  React.useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isMobile]);

  const stringifiedResults = JSON.stringify(results);
  React.useEffect(() => {
    if (stringifiedResults) {
      const arrayResults = JSON.parse(stringifiedResults);
      if (arrayResults && arrayResults.length > 0) {
        doResolveUris(arrayResults);
      }
    }
  }, [doResolveUris, stringifiedResults]);

  return (
    <>
      <Form
        className={classnames('wunderbar__wrapper', { 'wunderbar__wrapper--mobile': isMobile })}
        onSubmit={() => handleSelect(term)}
      >
        <Combobox className="wunderbar" onSelect={handleSelect}>
          <Icon icon={ICONS.SEARCH} />
          <ComboboxInput
            ref={inputRef}
            className="wunderbar__input"
            placeholder={__('Search')}
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />

          {isFocused && results && results.length > 0 && (
            <ComboboxPopover
              portal={false}
              className={classnames('wunderbar__suggestions', { 'wunderbar__suggestions--mobile': isMobile })}
            >
              <ComboboxList>
                {uriFromQueryIsValid ? <WunderbarTopSuggestion query={nameFromQuery} /> : null}

                <div className="wunderbar__label">{__('Search Results')}</div>
                {results.slice(0, isMobile ? 20 : 5).map((uri) => (
                  <WunderbarSuggestion key={uri} uri={uri} />
                ))}
                <ComboboxOption value={term} className="wunderbar__more-results">
                  <Button button="link" label={__('View All Results')} />
                </ComboboxOption>
              </ComboboxList>
            </ComboboxPopover>
          )}
        </Combobox>
      </Form>
      {isMobile && !term && (
        <div className="main--empty">
          <Yrbl subtitle={__('Search for something...')} alwaysShow />
        </div>
      )}

      {isMobile && noResults && (
        <div className="main--empty">
          <Yrbl type="sad" subtitle={__('No results')} alwaysShow />
        </div>
      )}
    </>
  );
}
