// @flow
import { URL, URL_LOCAL, URL_DEV } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
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

const WEB_DEV_PREFIX = `${URL_DEV}/`;
const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
const WEB_PROD_PREFIX = `${URL}/`;
const SEARCH_PREFIX = `$/${PAGES.SEARCH}q=`;
const INVALID_URL_ERROR = "Invalid LBRY URL entered. Only A-Z, a-z, 0-9, and '-' allowed.";

const L_KEY_CODE = 76;
const ESC_KEY_CODE = 27;

type Props = {
  searchQuery: ?string,
  onSearch: string => void,
  navigateToSearchPage: string => void,
  doResolveUris: string => void,
  doShowSnackBar: string => void,
  showMature: boolean,
};

export default function WunderBar(props: Props) {
  const { navigateToSearchPage, doShowSnackBar, doResolveUris, showMature } = props;
  const inputRef = React.useRef();
  const {
    push,
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const queryFromUrl = urlParams.get('q') || '';
  const [term, setTerm] = React.useState(queryFromUrl);
  const throttledTerm = useThrottle(term, 500) || '';
  const { results } = useLighthouse(throttledTerm, showMature);
  const nameFromQuery = throttledTerm
    .trim()
    .replace(/\s+/g, '')
    .replace(/:/g, '#');
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
    const includesLbryTvProd = value.includes(WEB_PROD_PREFIX);
    const includesLbryTvLocal = value.includes(WEB_LOCAL_PREFIX);
    const includesLbryTvDev = value.includes(WEB_DEV_PREFIX);
    const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd;
    const isLbryUrl = value.startsWith('lbry://');

    if (inputRef.current) {
      inputRef.current.blur();
    }

    if (wasCopiedFromWeb) {
      let prefix = WEB_PROD_PREFIX;
      if (includesLbryTvLocal) prefix = WEB_LOCAL_PREFIX;
      if (includesLbryTvDev) prefix = WEB_DEV_PREFIX;

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
      try {
        if (isURIValid(value)) {
          const uri = normalizeURI(value);
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputRef]);

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
    <Form className="wunderbar__wrapper" onSubmit={() => handleSelect(term)}>
      <Combobox className="wunderbar" onSelect={handleSelect}>
        <Icon icon={ICONS.SEARCH} />
        <ComboboxInput
          ref={inputRef}
          className="wunderbar__input"
          placeholder={__('Search')}
          onChange={e => setTerm(e.target.value)}
          value={term}
        />

        {results && results.length > 0 && (
          <ComboboxPopover portal={false} className="wunderbar__suggestions">
            <ComboboxList>
              {uriFromQueryIsValid ? <WunderbarTopSuggestion query={nameFromQuery} /> : null}

              <div className="wunderbar__label--results">{__('Search Results')}</div>
              {results.slice(0, 5).map(uri => (
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
  );
}
