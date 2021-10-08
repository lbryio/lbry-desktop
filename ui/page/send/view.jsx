// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletSend from 'component/walletSend';
import { URL as SITE_URL, URL_LOCAL, URL_DEV } from 'config';
import { parseURI, isNameValid, isURIValid, normalizeURI } from 'util/lbryURI';

type Props = {};

export default function SendPage(props: Props) {
  const [isAddress, setIsAddress] = React.useState(true);
  const [contentUri, setContentUri] = React.useState('');
  const [draftTransaction, setDraftTransaction] = React.useState({ address: '', amount: '' });
  const [enteredContent, setEnteredContentUri] = React.useState(undefined);
  const contentFirstRender = React.useRef(true);
  const [contentError, setContentError] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const [sendLabel, setSendLabel] = React.useState('Send');

  function getSearchUri(value) {
    const WEB_DEV_PREFIX = `${URL_DEV}/`;
    const WEB_LOCAL_PREFIX = `${URL_LOCAL}/`;
    const WEB_PROD_PREFIX = `${SITE_URL}/`;
    const ODYSEE_PREFIX = `https://odysee.com/`;
    const includesLbryTvProd = value.includes(WEB_PROD_PREFIX);
    const includesOdysee = value.includes(ODYSEE_PREFIX);
    const includesLbryTvLocal = value.includes(WEB_LOCAL_PREFIX);
    const includesLbryTvDev = value.includes(WEB_DEV_PREFIX);
    const wasCopiedFromWeb = includesLbryTvDev || includesLbryTvLocal || includesLbryTvProd || includesOdysee;
    const isLbryUrl = value.startsWith('lbry://') && value !== 'lbry://';
    const error = '';

    const addLbryIfNot = (term) => {
      return term.startsWith('lbry://') ? term : `lbry://${term}`;
    };
    if (wasCopiedFromWeb) {
      let prefix = WEB_PROD_PREFIX;
      if (includesLbryTvLocal) prefix = WEB_LOCAL_PREFIX;
      if (includesLbryTvDev) prefix = WEB_DEV_PREFIX;
      if (includesOdysee) prefix = ODYSEE_PREFIX;

      let query = (value && value.slice(prefix.length).replace(/:/g, '#')) || '';
      try {
        const lbryUrl = `lbry://${query}`;
        parseURI(lbryUrl);
        return [lbryUrl, null];
      } catch (e) {
        return [query, 'error'];
      }
    }

    if (!isLbryUrl) {
      if (value.startsWith('@')) {
        if (isNameValid(value.slice(1))) {
          return [value, null];
        } else {
          return [value, error];
        }
      }
      return [addLbryIfNot(value), null];
    } else {
      try {
        const isValid = isURIValid(value);
        if (isValid) {
          let uri;
          try {
            uri = normalizeURI(value);
          } catch (e) {
            return [value, null];
          }
          return [uri, null];
        } else {
          return [value, null];
        }
      } catch (e) {
        return [value, 'error'];
      }
    }
  }

  // setContentUri given enteredUri
  React.useEffect(() => {
    if (!enteredContent && !contentFirstRender.current) {
      setContentError(__('A name is required'));
    }
    if (enteredContent) {
      contentFirstRender.current = false;
      const [searchContent, error] = getSearchUri(enteredContent);
      if (error) {
        setContentError(__('Something not quite right..'));
      } else {
        setContentError('');
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
      } catch (e) {
        if (enteredContent !== '@') setContentError('');
        setContentUri(``);
      }
    }
  }, [enteredContent, setContentUri, setContentError, parseURI, isNameValid]);

  return (
    <Page
      noSideNavigation
      className="main--send"
      backout={{
        backoutLabel: __('Done'),
        title: (
          <>
            <LbcSymbol prefix={__('Send')} size={28} />
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
