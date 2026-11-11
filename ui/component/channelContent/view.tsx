import * as CS from "constants/claim_search";
import * as ICONS from "constants/icons";
import React, { Fragment } from "react";
import HiddenNsfwClaims from "component/hiddenNsfwClaims";
import { useHistory } from "react-router-dom";
import Button from "component/button";
import ClaimListDiscover from "component/claimListDiscover";
import Icon from "component/common/icon";
import { Form, FormField } from "component/common/form";
import { DEBOUNCE_WAIT_DURATION_MS } from "constants/search";
import { lighthouse } from "redux/actions/search";

const TYPES_TO_ALLOW_FILTER = ["stream", "repost"];

type Props = {
  uri: string;
  totalPages: number;
  fetching: boolean;
  params: {
    page: number;
  };
  pageOfClaimsInChannel: Array<StreamClaim>;
  channelIsBlocked: boolean;
  channelIsMine: boolean;
  fetchClaims: (arg1: string, arg2: number) => void;
  channelIsBlackListed: boolean;
  defaultPageSize?: number;
  defaultInfiniteScroll?: boolean;
  claim: Claim;
  isAuthenticated: boolean;
  showMature: boolean;
  tileLayout: boolean;
  viewHiddenChannels: boolean;
  doResolveUris: (arg1: Array<string>, arg2: boolean) => void;
  claimType: string;
  empty?: string;
};

function ChannelContent(props: Props) {
  const {
    uri,
    fetching,
    channelIsMine,
    channelIsBlocked,
    channelIsBlackListed,
    claim,
    defaultPageSize = CS.PAGE_SIZE,
    defaultInfiniteScroll = true,
    showMature,
    tileLayout,
    viewHiddenChannels,
    doResolveUris,
    claimType,
    empty,
  } = props;
  const claimsInChannel = 9999;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any>(undefined);
  const {
    location: { pathname, search },
  } = useHistory();
  const url = `${pathname}${search}`;
  const claimId = claim && claim.claim_id;
  const showFilters =
    !claimType ||
    (Array.isArray(claimType)
      ? claimType.every((ct) => TYPES_TO_ALLOW_FILTER.includes(ct))
      : TYPES_TO_ALLOW_FILTER.includes(claimType));

  function handleInputChange(e: unknown) {
    // @ts-expect-error - TS2339 - Property 'target' does not exist on type 'unknown'.
    const { value } = e.target;
    setSearchQuery(value);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === "" || !claimId) {
        // In order to display original search results, search results must be set to null. A query of '' should display original results.
        return setSearchResults(null);
      } else {
        lighthouse
          .search(
            `s=${encodeURIComponent(searchQuery)}&channel_id=${encodeURIComponent(claimId)}${
              !showMature ? "&nsfw=false&size=50&from=0" : ""
            }`
          )
          .then(({ body: results }) => {
            const urls = results.map(({ name, claimId }) => {
              return `lbry://${name}#${claimId}`;
            });

            // Batch-resolve the urls before calling 'setSearchResults', as the
            // latter will immediately cause the tiles to resolve, ending up
            // calling doResolveUri one by one before the batched one.
            doResolveUris(urls, true);

            setSearchResults(urls);
          })
          .catch(() => {
            setSearchResults(null);
          });
      }
    }, DEBOUNCE_WAIT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [claimId, doResolveUris, searchQuery, showMature]);

  React.useEffect(() => {
    setSearchQuery("");
    setSearchResults(null);
  }, [url]);

  return (
    <Fragment>
      {!fetching && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        // @ts-expect-error - TS2322 (ts-migration)
        <HiddenNsfwClaims uri={uri} />
      )}
      {!fetching && channelIsBlackListed && (
        <section className="card card--section">
          <p>
            {__(
              "In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this channel from our applications."
            )}
          </p>
          <div className="section__actions">
            {/* @ts-expect-error - TS2322 (ts-migration) */}
            <Button button="link" href="https://lbry.com/faq/dmca" label={__("Read More")} />
          </div>
        </section>
      )}

      {!fetching && channelIsBlocked && (
        <div className="card--section">
          <h2 className="help">{__("You have blocked this channel content.")}</h2>
        </div>
      )}

      {/* @ts-expect-error - TS2322 (ts-migration) */}
      {!channelIsMine && claimsInChannel > 0 && <HiddenNsfwClaims uri={uri} />}

      <ClaimListDiscover
        hasSource
        defaultFreshness={CS.FRESH_ALL}
        showHiddenByUser={viewHiddenChannels}
        forceShowReposts
        fetchViewCount
        hideFilters={!showFilters}
        hideAdvancedFilter={!showFilters}
        tileLayout={tileLayout}
        uris={searchResults}
        channelIds={[claimId]}
        claimType={claimType}
        feeAmount={CS.FEE_AMOUNT_ANY}
        defaultOrderBy={CS.ORDER_BY_NEW}
        pageSize={defaultPageSize}
        infiniteScroll={defaultInfiniteScroll}
        meta={
          showFilters && (
            // @ts-expect-error - TS2769 - No overload matches this call.
            <Form onSubmit={() => {}} className="wunderbar--inline">
              <Icon icon={ICONS.SEARCH} />
              <FormField
                // @ts-expect-error - TS2322 - Type '{ className: string; value: string; onChange: (e: unknown) => void; type: string; placeholder: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                className="wunderbar__input--inline"
                value={searchQuery}
                onChange={handleInputChange}
                type="text"
                placeholder={__("Search")}
              />
            </Form>
          )
        }
        isChannel
        channelIsMine={channelIsMine}
        empty={empty}
      />
    </Fragment>
  );
}

export default ChannelContent;
