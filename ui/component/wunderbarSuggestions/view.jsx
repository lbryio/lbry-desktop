// @flow
import type { ElementRef } from 'react';
import { URL, URL_LOCAL, URL_DEV, KNOWN_APP_DOMAINS } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import { isURIValid, normalizeURI, parseURI } from 'util/lbryURI';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
// import '@reach/combobox/styles.css'; --> 'scss/third-party.scss'
import useLighthouse from 'effects/use-lighthouse';
import { Form } from 'component/common/form';
import Button from 'component/button';
import WunderbarTopSuggestion from 'component/wunderbarTopSuggestion';
import WunderbarSuggestion from 'component/wunderbarSuggestion';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';
import Yrbl from 'component/yrbl';
import { SEARCH_OPTIONS } from 'constants/search';
import Spinner from 'component/spinner';

const LBRY_PROTOCOL = 'lbry://';
const WEB_DEV_PREFIX = `${URL_DEV}/`;
const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
const WEB_PROD_PREFIX = `${URL}/`;
const SEARCH_PREFIX = `$/${PAGES.SEARCH}q=`;
const INVALID_URL_ERROR = "Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and '-' allowed.";
const TAG_SEARCH_PREFIX = 'tag:';

const K_KEY_CODE = 75;
const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;

const WUNDERBAR_INPUT_DEBOUNCE_MS = 1000;
const LIGHTHOUSE_MIN_CHARACTERS = 3;

type Props = {
  searchQuery: ?string,
  onSearch: (string) => void,
  navigateToSearchPage: (string) => void,
  doResolveUris: (string) => void,
  doShowSnackBar: (string) => void,
  showMature: boolean,
  isMobile: boolean,
  doCloseMobileSearch: () => void,
  channelsOnly?: boolean,
  noTopSuggestion?: boolean,
  noBottomLinks?: boolean,
  customSelectAction?: (string) => void,
};

export default function WunderBarSuggestions(props: Props) {
  const {
    navigateToSearchPage,
    doShowSnackBar,
    doResolveUris,
    showMature,
    isMobile,
    doCloseMobileSearch,
    channelsOnly,
    noTopSuggestion,
    noBottomLinks,
    customSelectAction,
  } = props;
  const inputRef: ElementRef<any> = React.useRef();
  const viewResultsRef: ElementRef<any> = React.useRef();
  const exploreTagRef: ElementRef<any> = React.useRef();

  const isRefFocused = (ref) => ref && ref.current && ref.current === document.activeElement;
  const isFocused = isRefFocused(inputRef) || isRefFocused(viewResultsRef) || isRefFocused(exploreTagRef);

  const {
    push,
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const queryFromUrl = urlParams.get('q') || '';
  const [term, setTerm] = React.useState(queryFromUrl);
  const [debouncedTerm, setDebouncedTerm] = React.useState('');
  const searchSize = isMobile ? 20 : 5;
  const additionalOptions = channelsOnly
    ? { isBackgroundSearch: false, [SEARCH_OPTIONS.CLAIM_TYPE]: SEARCH_OPTIONS.INCLUDE_CHANNELS }
    : {};
  const { results, loading } = useLighthouse(debouncedTerm, showMature, searchSize, additionalOptions, 0);
  const noResults = debouncedTerm && !loading && results && results.length === 0;
  const nameFromQuery = debouncedTerm.trim().replace(/\s+/g, '').replace(/:/g, '#');
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

  const isTyping = debouncedTerm !== term;
  const showPlaceholder = isTyping || loading;

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

    if (customSelectAction) {
      // Give them full results, as our resolved one might truncate the claimId.
      customSelectAction(results ? results.find((r) => r.startsWith(value)) : '');
      return;
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

    if (value.startsWith(TAG_SEARCH_PREFIX)) {
      const tag = value.slice(TAG_SEARCH_PREFIX.length);
      push(`/$/${PAGES.DISCOVER}?t=${tag}`);
    } else if (!isLbryUrl) {
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
    const timer = setTimeout(() => {
      if (debouncedTerm !== term) {
        setDebouncedTerm(term.length < LIGHTHOUSE_MIN_CHARACTERS ? '' : term);
      }
    }, WUNDERBAR_INPUT_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [term, debouncedTerm]);

  React.useEffect(() => {
    function handleHomeEndCaretPos(elem, shiftKey, isHome) {
      if (elem) {
        const cur = elem.selectionStart ? elem.selectionStart : 0;
        let begin;
        let final;
        let scrollPx;
        let direction = 'none';

        if (isHome) {
          begin = 0;
          final = shiftKey ? cur : begin;
          scrollPx = 0;
          direction = 'backward';
        } else {
          final = elem.value.length;
          begin = shiftKey ? cur : final;
          scrollPx = elem.scrollWidth - elem.clientWidth;
        }

        elem.setSelectionRange(begin, final, direction);
        elem.scrollLeft = scrollPx;
        return true;
      }

      return false;
    }

    function overrideHomeEndHandling(event) {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      if (!ctrlKey && !metaKey) {
        if (key === 'Home' || key === 'End') {
          if (handleHomeEndCaretPos(inputRef.current, shiftKey, key === 'Home')) {
            event.stopPropagation();
          }
        }
      }
    }

    // Injecting the listener at the element level puts it before
    // ReachUI::ComboBoxInput's listener, allowing us to skip their handling.
    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', overrideHomeEndHandling);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', overrideHomeEndHandling);
      }
    };
  }, [inputRef]);

  React.useEffect(() => {
    function handleKeyDown(event) {
      const { ctrlKey, metaKey, keyCode } = event;

      if (!inputRef.current) {
        return;
      }

      if (keyCode === K_KEY_CODE && ctrlKey) {
        inputRef.current.focus();
        inputRef.current.select();
        return;
      }

      if (inputRef.current === document.activeElement && keyCode === ESC_KEY_CODE) {
        // If the user presses escape and the text has already been cleared then blur the widget
        if (inputRef.current.value === '') {
          inputRef.current.blur();
        } else {
          // Remove the current text
          inputRef.current.value = '';
          inputRef.current.focus();
        }
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
        <Combobox className="wunderbar" onSelect={handleSelect} openOnFocus>
          <Icon icon={ICONS.SEARCH} />
          <ComboboxInput
            ref={inputRef}
            className="wunderbar__input"
            placeholder={__('Search')}
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />

          {isFocused && (
            <ComboboxPopover
              portal={false}
              className={classnames('wunderbar__suggestions', { 'wunderbar__suggestions--mobile': isMobile })}
            >
              <ComboboxList>
                {!noBottomLinks && (
                  <div className="wunderbar__bottom-links">
                    <ComboboxOption value={term} className="wunderbar__more-results">
                      <Button ref={viewResultsRef} button="link" label={__('View All Results')} />
                    </ComboboxOption>
                    <ComboboxOption value={`${TAG_SEARCH_PREFIX}${term}`} className="wunderbar__more-results">
                      <Button ref={exploreTagRef} className="wunderbar__tag-search" button="link">
                        {__('Explore')}
                        <div className="tag">{term.split(' ').join('')}</div>
                      </Button>
                    </ComboboxOption>
                  </div>
                )}

                <hr className="wunderbar__top-separator" />

                {uriFromQueryIsValid && !noTopSuggestion ? <WunderbarTopSuggestion query={nameFromQuery} /> : null}

                <div className="wunderbar__label">{__('Search Results')}</div>

                {showPlaceholder && term.length > LIGHTHOUSE_MIN_CHARACTERS ? <Spinner type="small" /> : null}

                {!showPlaceholder && results
                  ? results.slice(0, isMobile ? 20 : 5).map((uri) => <WunderbarSuggestion key={uri} uri={uri} />)
                  : null}
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
