import {SEARCH_SERVER_API, LBRY_SEARCH_API} from 'config';
import React from 'react';
import { FormField } from 'component/common/form';
import { SEARCH_PROVIDERS } from 'constants/search';

const DEBOUNCE_TEXT_INPUT_MS = 500;

type Props = {
  provider: string,
  lbrySearchUrl: string,
  setProvider: (arg1: string) => void,
  setLbrySearchUrl: (arg1: string) => void
};

function SettingSearchServer(props: Props) {
  const { provider, lbrySearchUrl, setProvider, setLbrySearchUrl } = props;
  const [url, setUrl] = React.useState(lbrySearchUrl);
  const useLbrySearch = provider === SEARCH_PROVIDERS.LBRY_SEARCH;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (url !== lbrySearchUrl) {
        setLbrySearchUrl(url);
      }
    }, DEBOUNCE_TEXT_INPUT_MS);

    return () => clearTimeout(timer);
  }, [url, lbrySearchUrl, setLbrySearchUrl]);

  return (
    <fieldset-section>
      <FormField
        type="radio"
        name="search_provider_lighthouse"
        label={
          <span className="compound-label">
            <span>{__('Lighthouse')}</span>
            <span className="compound-label__details">{SEARCH_SERVER_API}</span>
          </span>
        }
        checked={!useLbrySearch}
        onChange={(e) => e.target.checked && setProvider(SEARCH_PROVIDERS.LIGHTHOUSE)}
      />
      <FormField
        type="radio"
        name="search_provider_lbry_search"
        label={
          <span className="compound-label">
            <span>{__('lbry-search')}</span>
            <span className="compound-label__details">{__('Searches an index built from your own LBRY node')}</span>
          </span>
        }
        checked={useLbrySearch}
        onChange={(e) => e.target.checked && setProvider(SEARCH_PROVIDERS.LBRY_SEARCH)}
      />

      {useLbrySearch && (
        <div className="section__body">
          <FormField
            type="text"
            label={__('GraphQL URL')}
            placeholder={LBRY_SEARCH_API}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}
    </fieldset-section>
  );
}

export default SettingSearchServer;
