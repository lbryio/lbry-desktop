import * as ICONS from "constants/icons";
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from "constants/claim";
import React from "react";
import { useHistory } from "react-router";
import Card from "component/common/card";
import Button from "component/button";
import ChannelSelector from "component/channelSelector";
import { FormField } from "component/common/form";
import { parseURI, isNameValid, isURIValid, normalizeURI } from "util/lbryURI";
import { creditsToString } from "util/format-credits";
import analytics from "analytics";
import LbcSymbol from "component/common/lbc-symbol";
import ClaimPreview from "component/claimPreview";
// @ts-expect-error - TS2305 (ts-migration)
import { URL as SITE_URL, URL_LOCAL, URL_DEV } from "config";
import HelpLink from "component/common/help-link";
import WalletSpendableBalanceHelp from "component/walletSpendableBalanceHelp";
import BidHelpText from "component/publishBid/bid-help-text";
import Spinner from "component/spinner";

type Props = {
  doToast: (arg1: { message: string }) => void;
  doClearRepostError: () => void;
  doRepost: (arg1: StreamRepostOptions) => Promise<any>;
  doHideModal: () => void;
  title: string;
  claim?: StreamClaim;
  enteredContentClaim?: StreamClaim;
  balance: number;
  doCheckPublishNameAvailability: (arg1: string) => Promise<any>;
  error: string | null | undefined;
  reposting: boolean;
  uri: string;
  name: string;
  doCheckPendingClaims: () => void;
  passedRepostAmount: number;
  enteredRepostAmount: number;
  isResolvingPassedRepost: boolean;
  isResolvingEnteredRepost: boolean;
  activeChannelClaim: ChannelClaim | null | undefined;
  fetchingMyChannels: boolean;
  incognito: boolean;
  contentUri: string;
  setContentUri: (arg1: string) => void;
  repostUri: string;
  setRepostUri: (arg1: string) => void;
  isModal: boolean;
  redirectUri?: string;
};

function RepostCreate(props: Props) {
  const {
    doToast,
    doClearRepostError,
    doRepost,
    claim,
    enteredContentClaim,
    balance,
    reposting,
    doCheckPublishNameAvailability,
    uri, // ?from
    name, // ?to
    doCheckPendingClaims,
    enteredRepostAmount,
    passedRepostAmount,
    isResolvingPassedRepost,
    isResolvingEnteredRepost,
    activeChannelClaim,
    fetchingMyChannels,
    incognito,
    doHideModal,
    contentUri,
    setContentUri,
    setRepostUri,
    isModal,
    redirectUri,
  } = props;

  const defaultName = name || (claim && claim.name) || "";
  const contentClaimId = claim && claim.claim_id;
  const enteredClaimId = enteredContentClaim && enteredContentClaim.claim_id;

  const [repostBid, setRepostBid] = React.useState(0.01);
  const [repostBidError, setRepostBidError] = React.useState<any>(undefined);
  const [enteredRepostName, setEnteredRepostName] = React.useState(defaultName);
  const [available, setAvailable] = React.useState(true);
  const [enteredContent, setEnteredContentUri] = React.useState<any>(undefined);
  const [contentError, setContentError] = React.useState("");
  const { replace, goBack } = useHistory();

  const resolvingRepost = isResolvingEnteredRepost || isResolvingPassedRepost;
  const repostUrlName = `lbry://${incognito || !activeChannelClaim ? "" : `${activeChannelClaim.name}/`}`;

  const contentFirstRender = React.useRef(true);
  const setAutoRepostBid = (amount: unknown) => {
    if (balance && balance > 0.02) {
      if (uri) {
        setRepostBid(0.01);
        // @ts-expect-error - TS2365 (ts-migration)
      } else if (balance > amount) {
        // @ts-expect-error - TS2339 - Property 'toFixed' does not exist on type 'unknown'.
        setRepostBid(Number(amount.toFixed(2)));
      } else {
        setRepostBid(0.01);
      }
    }
  };

  function getSearchUri(value: unknown) {
    const WEB_DEV_PREFIX = `${URL_DEV}/`;
    const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
    const WEB_PROD_PREFIX = `${SITE_URL}/`;
    const ODYSEE_PREFIX = `https://odysee.com/`;
    // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
    const includesLbryTvProd = value.includes(WEB_PROD_PREFIX);
    // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
    const includesOdysee = value.includes(ODYSEE_PREFIX);
    // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
    const includesLbryTvLocal = value.includes(WEB_LOCAL_PREFIX);
    // @ts-expect-error - TS2339 - Property 'includes' does not exist on type 'unknown'.
    const includesLbryTvDev = value.includes(WEB_DEV_PREFIX);
    const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd || includesOdysee;
    // @ts-expect-error - TS2339 - Property 'startsWith' does not exist on type 'unknown'.
    const isLbryUrl = value.startsWith("lbry://") && value !== "lbry://";
    const error = "";

    const addLbryIfNot = (term: unknown) => {
      // @ts-expect-error - TS2339 - Property 'startsWith' does not exist on type 'unknown'.
      return term.startsWith("lbry://") ? term : `lbry://${term}`;
    };
    if (wasCopiedFromWeb) {
      let prefix = WEB_PROD_PREFIX;
      if (includesLbryTvLocal) prefix = WEB_LOCAL_PREFIX;
      if (includesLbryTvDev) prefix = WEB_DEV_PREFIX;
      if (includesOdysee) prefix = ODYSEE_PREFIX;

      // @ts-expect-error - TS2339 - Property 'slice' does not exist on type 'unknown'.
      const query = (value && value.slice(prefix.length).replace(/:/g, "#")) || "";
      try {
        const lbryUrl = `lbry://${query}`;
        parseURI(lbryUrl);
        return [lbryUrl, null];
      } catch (e: any) {
        return [query, "error"];
      }
    }

    if (!isLbryUrl) {
      // @ts-expect-error - TS2339 - Property 'startsWith' does not exist on type 'unknown'.
      if (value.startsWith("@")) {
        // @ts-expect-error - TS2339 - Property 'slice' does not exist on type 'unknown'.
        if (isNameValid(value.slice(1))) {
          return [value, null];
        } else {
          return [value, error];
        }
      }
      return [addLbryIfNot(value), null];
    } else {
      try {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        const isValid = isURIValid(value);
        if (isValid) {
          let uri;
          try {
            // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
            uri = normalizeURI(value);
          } catch (e: any) {
            return [value, null];
          }
          return [uri, null];
        } else {
          return [value, null];
        }
      } catch (e: any) {
        return [value, "error"];
      }
    }
  }
  // repostName
  let repostNameError;
  if (!enteredRepostName) {
    repostNameError = __("A name is required");
  } else if (!isNameValid(enteredRepostName)) {
    repostNameError = INVALID_NAME_ERROR;
  } else if (!available) {
    repostNameError = __("You already have a claim with this name.");
  }

  // contentName
  let contentNameError;
  if (!enteredContent && enteredContent !== undefined) {
    contentNameError = __("A name is required");
  }

  React.useEffect(() => {
    if (enteredRepostName && isNameValid(enteredRepostName)) {
      doCheckPublishNameAvailability(enteredRepostName).then((r) => setAvailable(r));
    }
  }, [enteredRepostName, doCheckPublishNameAvailability]);

  // takeover amount, bid suggestion
  React.useEffect(() => {
    const repostTakeoverAmount = Number(enteredRepostAmount)
      ? Number(enteredRepostAmount) + 0.01
      : Number(passedRepostAmount) + 0.01;

    if (repostTakeoverAmount) {
      setAutoRepostBid(repostTakeoverAmount);
    }
  }, [setAutoRepostBid, enteredRepostAmount, passedRepostAmount]);

  // repost bid error
  React.useEffect(() => {
    let rBidError;
    if (repostBid === 0) {
      rBidError = __("Deposit cannot be 0");
    } else if (balance === repostBid) {
      rBidError = __("Please decrease your deposit to account for transaction fees");
    } else if (balance < repostBid) {
      rBidError = __("Deposit cannot be higher than your available balance");
    } else if (repostBid < MINIMUM_PUBLISH_BID) {
      rBidError = __("Your deposit must be higher");
    }
    setRepostBidError(rBidError);
  }, [balance, setRepostBidError, repostBidError, repostBid]);

  // setContentUri given enteredUri
  React.useEffect(() => {
    if (!enteredContent && !contentFirstRender.current) {
      setContentError(__("A name is required"));
    }
    if (enteredContent) {
      contentFirstRender.current = false;
      const [searchContent, error] = getSearchUri(enteredContent);
      if (error) {
        setContentError(__("Something not quite right.."));
      } else {
        setContentError("");
      }
      try {
        const { streamName, channelName, isChannel } = parseURI(searchContent);
        if (!isChannel && streamName && isNameValid(streamName)) {
          // contentNameValid = true;
          setContentUri(searchContent);
        } else if (isChannel && channelName && isNameValid(channelName)) {
          // contentNameValid = true;
          setContentUri(searchContent);
        }
      } catch (e: any) {
        if (enteredContent !== "@") setContentError("");
        setContentUri(``);
      }
    }
  }, [enteredContent, setContentUri, setContentError, parseURI, isNameValid]);

  // setRepostName
  React.useEffect(() => {
    if (enteredRepostName) {
      let isValid = false;
      try {
        parseURI(enteredRepostName);
        isValid = true;
      } catch (e: any) {
        isValid = false;
      }
      if (isValid) {
        setRepostUri(enteredRepostName);
      }
    }
  }, [enteredRepostName, setRepostUri, parseURI]);

  const repostClaimId = contentClaimId || enteredClaimId;

  const getRedirect = (entered: unknown, passed: unknown, redirect: unknown) => {
    if (redirect) {
      return redirect;
    } else if (entered) {
      try {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        const { claimName } = parseURI(entered);
        return claimName ? `/${claimName}` : "/";
      } catch (e: any) {
        return "/";
      }
    } else if (passed) {
      try {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        const { claimName } = parseURI(passed);
        return claimName ? `/${claimName}` : "/";
      } catch (e: any) {
        return "/";
      }
    } else {
      return "/";
    }
  };

  function handleSubmit() {
    if (enteredRepostName && repostBid && repostClaimId) {
      doRepost({
        name: enteredRepostName,
        bid: creditsToString(repostBid),
        channel_id: activeChannelClaim && !incognito ? activeChannelClaim.claim_id : undefined,
        claim_id: repostClaimId,
      }).then((repostClaim: StreamClaim) => {
        doCheckPendingClaims();
        analytics.apiLogPublish(repostClaim);
        doToast({
          message: __("Woohoo! Successfully reposted this claim."),
          // @ts-expect-error - TS2345 - Argument of type '{ message: string; linkText: string; linkTarget: string; }' is not assignable to parameter of type '{ message: string; }'.
          linkText: __("Uploads"),
          linkTarget: "/uploads",
        });
        if (isModal) {
          doHideModal();
        } else {
          replace(getRedirect(contentUri, uri, redirectUri));
        }
      });
    }
  }

  function cancelIt() {
    doClearRepostError();
    if (isModal) {
      doHideModal();
    } else {
      goBack();
    }
  }

  if (fetchingMyChannels) {
    return (
      <div className="main--empty">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Card
        className="repost-wrapper"
        actions={
          <div>
            {/* @ts-expect-error - TS2739 (ts-migration) */}
            <ChannelSelector />
            {uri && (
              // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
              <fieldset-section>
                <ClaimPreview key={uri} uri={uri} actions={""} showNullPlaceholder />
                {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              </fieldset-section>
            )}
            {!uri && name && (
              <>
                <FormField
                  label={__("Content to repost")}
                  type="text"
                  name="content_url"
                  value={enteredContent}
                  error={contentError}
                  onChange={(event) => setEnteredContentUri(event.target.value)}
                  placeholder={__("Enter a name or %domain% URL", { domain: SITE_URL })}
                />
              </>
            )}

            {!uri && (
              // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
              <fieldset-section>
                <ClaimPreview key={contentUri} uri={contentUri} actions={""} type={"large"} showNullPlaceholder />
                {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              </fieldset-section>
            )}

            <React.Fragment>
              {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              <fieldset-section>
                {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
                  <fieldset-section>
                    <label htmlFor="auth_first_channel">
                      {repostNameError ? (
                        <span className="error__text">{repostNameError}</span>
                      ) : (
                        <span>
                          {__("Repost URL")}
                          <HelpLink href="https://lbry.com/faq/naming" />
                        </span>
                      )}
                    </label>
                    <div className="form-field__prefix">{repostUrlName}</div>
                    {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
                  </fieldset-section>
                  <FormField
                    type="text"
                    name="repost_name"
                    value={enteredRepostName}
                    onChange={(event) => setEnteredRepostName(event.target.value)}
                    placeholder={__("MyFunName")}
                  />
                  {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                </fieldset-group>
                {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              </fieldset-section>

              <FormField
                type="number"
                name="repost_bid"
                // @ts-expect-error - TS2322 - Type 'string' is not assignable to type 'number'.
                min="0"
                step="any"
                placeholder="0.123"
                className="form-field--price-amount"
                label={<LbcSymbol postfix={__("Support --[button to support a claim]--")} size={14} />}
                value={repostBid}
                error={repostBidError}
                helper={
                  <>
                    <BidHelpText
                      uri={"lbry://" + enteredRepostName}
                      amountNeededForTakeover={enteredRepostAmount}
                      isResolvingUri={isResolvingEnteredRepost}
                    />
                    <WalletSpendableBalanceHelp inline />
                  </>
                }
                disabled={!enteredRepostName || resolvingRepost}
                onChange={(event) => setRepostBid(event.target.value)}
                onWheel={(e) => e.stopPropagation()}
              />
            </React.Fragment>

            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                icon={ICONS.REPOST}
                disabled={
                  resolvingRepost ||
                  reposting ||
                  repostBidError ||
                  repostNameError ||
                  ((!uri || enteredContent) && contentNameError) ||
                  (!uri && !enteredContentClaim)
                }
                button="primary"
                label={reposting ? __("Reposting") : __("Repost")}
                onClick={handleSubmit}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__("Cancel")} onClick={cancelIt} />
            </div>
          </div>
        }
      />
    </>
  );
}

export default RepostCreate;
