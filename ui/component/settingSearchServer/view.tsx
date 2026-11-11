import { SEARCH_SERVER_API, LBRY_SEARCH_API } from "config";
import React from "react";
import { FormField } from "component/common/form";
import { SEARCH_PROVIDERS } from "constants/search";

const DEBOUNCE_TEXT_INPUT_MS = 500;

type Props = {
  provider: string;
  lbrySearchUrl: string;
  setProvider: (arg1: string) => void;
  setLbrySearchUrl: (arg1: string) => void;
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
    // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
    <fieldset-section>
      <FormField
        type="radio"
        name="search_provider_lighthouse"
        label={
          <span className="compound-label">
            <span>{__("Lighthouse")}</span>
            <span className="compound-label__details">{SEARCH_SERVER_API}</span>
          </span>
        }
        // @ts-expect-error - TS2322 (ts-migration)
        checked={!useLbrySearch}
        onChange={(e) => e.target.checked && setProvider(SEARCH_PROVIDERS.LIGHTHOUSE)}
      />
      <FormField
        type="radio"
        name="search_provider_lbry_search"
        label={
          <span className="compound-label">
            <span>{__("lbry-search")}</span>
            <span className="compound-label__details">{__("Searches an index built from your own LBRY node")}</span>
          </span>
        }
        // @ts-expect-error - TS2322 (ts-migration)
        checked={useLbrySearch}
        onChange={(e) => e.target.checked && setProvider(SEARCH_PROVIDERS.LBRY_SEARCH)}
      />

      {useLbrySearch && (
        <div className="section__body">
          {/* @ts-expect-error - TS2741 - Property 'name' is missing in type '{ type: string; label: string; placeholder: string; value: string; onChange: (e: any) => void; }' but required in type 'Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | "type" | "name" | "value" | "disabled" | "label" | "children" | "render" | ... 15 more ... | "onChange">'. */}
          <FormField
            type="text"
            label={__("GraphQL URL")}
            placeholder={LBRY_SEARCH_API}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}
      {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
    </fieldset-section>
  );
}

export default SettingSearchServer;
