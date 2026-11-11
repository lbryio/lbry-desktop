import React from "react";
import Page from "component/page";
import LbcSymbol from "component/common/lbc-symbol";
import WalletSend from "component/walletSend";
// @ts-expect-error - TS2305 (ts-migration)
import { URL as SITE_URL, URL_LOCAL, URL_DEV } from "config";
import { parseURI, isNameValid, isURIValid, normalizeURI } from "util/lbryURI";

type Props = Record<any, any>;

export default function SendPage(props: Props) {
  const [isAddress, setIsAddress] = React.useState(true);
  const [contentUri, setContentUri] = React.useState("");
  const [draftTransaction, setDraftTransaction] = React.useState({ address: "", amount: "" });
  const [enteredContent, setEnteredContentUri] = React.useState<any>(undefined);
  const contentFirstRender = React.useRef(true);
  const [contentError, setContentError] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [sendLabel, setSendLabel] = React.useState("Send");

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

  return (
    <Page
      noSideNavigation
      className="main--send"
      backout={{
        backoutLabel: __("Done"),
        // @ts-expect-error - TS2322 (ts-migration)
        title: (
          <>
            <LbcSymbol prefix={__("Send")} size={28} />
          </>
        ),
      }}
    >
      <WalletSend
        isAddress={isAddress}
        setIsAddress={setIsAddress}
        contentUri={contentUri}
        contentError={contentError}
        setEnteredContentUri={setEnteredContentUri}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        draftTransaction={draftTransaction}
        setDraftTransaction={setDraftTransaction}
        sendLabel={sendLabel}
        setSendLabel={setSendLabel}
      />
    </Page>
  );
}
