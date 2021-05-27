// @flow

import * as ICONS from 'constants/icons';
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';
import React from 'react';
import { useHistory } from 'react-router';
import Card from 'component/common/card';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import { FormField } from 'component/common/form';
import { parseURI, isNameValid, creditsToString, isURIValid, normalizeURI } from 'lbry-redux';
import analytics from 'analytics';
import LbcSymbol from 'component/common/lbc-symbol';
import ClaimPreview from 'component/claimPreview';
import { URL as SITE_URL, URL_LOCAL, URL_DEV } from 'config';
import HelpLink from 'component/common/help-link';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';
import Spinner from 'component/spinner';

type Props = {
  doToast: ({ message: string }) => void,
  doClearRepostError: () => void,
  doRepost: (StreamRepostOptions) => Promise<*>,
  title: string,
  claim?: StreamClaim,
  enteredContentClaim?: StreamClaim,
  balance: number,
  channels: ?Array<ChannelClaim>,
  doCheckPublishNameAvailability: (string) => Promise<*>,
  error: ?string,
  reposting: boolean,
  uri: string,
  name: string,
  contentUri: string,
  setRepostUri: (string) => void,
  setContentUri: (string) => void,
  doCheckPendingClaims: () => void,
  redirectUri?: string,
  passedRepostAmount: number,
  enteredRepostAmount: number,
  isResolvingPassedRepost: boolean,
  isResolvingEnteredRepost: boolean,
  activeChannelClaim: ?ChannelClaim,
  fetchingMyChannels: boolean,
  incognito: boolean,
};

function RepostCreate(props: Props) {
  const {
    redirectUri,
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
    contentUri,
    setRepostUri,
    setContentUri,
    doCheckPendingClaims,
    enteredRepostAmount,
    passedRepostAmount,
    isResolvingPassedRepost,
    isResolvingEnteredRepost,
    activeChannelClaim,
    fetchingMyChannels,
    incognito,
  } = props;

  const defaultName = name || (claim && claim.name) || '';
  const contentClaimId = claim && claim.claim_id;
  const enteredClaimId = enteredContentClaim && enteredContentClaim.claim_id;

  const [repostBid, setRepostBid] = React.useState(0.01);
  const [repostBidError, setRepostBidError] = React.useState(undefined);
  const [takeoverAmount, setTakeoverAmount] = React.useState(0);
  const [enteredRepostName, setEnteredRepostName] = React.useState(defaultName);
  const [available, setAvailable] = React.useState(true);
  const [enteredContent, setEnteredContentUri] = React.useState(undefined);
  const [contentError, setContentError] = React.useState('');

  const { replace, goBack } = useHistory();
  const resolvingRepost = isResolvingEnteredRepost || isResolvingPassedRepost;
  const repostUrlName = `lbry://${incognito || !activeChannelClaim ? '' : `${activeChannelClaim.name}/`}`;

  const contentFirstRender = React.useRef(true);
  const setAutoRepostBid = (amount) => {
    if (balance && balance > 0.02) {
      if (uri) {
        setRepostBid(0.01);
      } else if (balance > amount) {
        setRepostBid(Number(amount.toFixed(2)));
      } else {
        setRepostBid(0.01);
      }
    }
  };

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
  // repostName
  let repostNameError;
  if (!enteredRepostName) {
    repostNameError = __('A name is required');
  } else if (!isNameValid(enteredRepostName, false)) {
    repostNameError = INVALID_NAME_ERROR;
  } else if (!available) {
    repostNameError = __('You already have a claim with this name.');
  }

  // contentName
  let contentNameError;
  if (!enteredContent && enteredContent !== undefined) {
    contentNameError = __('A name is required');
  }

  React.useEffect(() => {
    if (enteredRepostName && isNameValid(enteredRepostName, false)) {
      doCheckPublishNameAvailability(enteredRepostName).then((r) => setAvailable(r));
    }
  }, [enteredRepostName, doCheckPublishNameAvailability]);

  // takeover amount, bid suggestion
  React.useEffect(() => {
    const repostTakeoverAmount = Number(enteredRepostAmount)
      ? Number(enteredRepostAmount) + 0.01
      : Number(passedRepostAmount) + 0.01;

    if (repostTakeoverAmount) {
      setTakeoverAmount(Number(repostTakeoverAmount.toFixed(2)));
      setAutoRepostBid(repostTakeoverAmount);
    }
  }, [setTakeoverAmount, enteredRepostAmount, passedRepostAmount]);

  // repost bid error
  React.useEffect(() => {
    let rBidError;
    if (repostBid === 0) {
      rBidError = __('Deposit cannot be 0');
    } else if (balance === repostBid) {
      rBidError = __('Please decrease your deposit to account for transaction fees');
    } else if (balance < repostBid) {
      rBidError = __('Deposit cannot be higher than your available balance');
    } else if (repostBid < MINIMUM_PUBLISH_BID) {
      rBidError = __('Your deposit must be higher');
    }
    setRepostBidError(rBidError);
  }, [setRepostBidError, repostBidError, repostBid]);

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

  // setRepostName
  React.useEffect(() => {
    if (enteredRepostName) {
      let isValid = false;
      try {
        parseURI(enteredRepostName);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      if (isValid) {
        setRepostUri(enteredRepostName);
      }
    }
  }, [enteredRepostName, setRepostUri, parseURI]);

  const repostClaimId = contentClaimId || enteredClaimId;

  const getRedirect = (entered, passed, redirect) => {
    if (redirect) {
      return redirect;
    } else if (entered) {
      try {
        const { claimName } = parseURI(entered);
        return `/${claimName}`;
      } catch (e) {
        return '/';
      }
    } else if (passed) {
      try {
        const { claimName } = parseURI(passed);
        return `/${claimName}`;
      } catch (e) {
        return '/';
      }
    } else {
      return '/';
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
        doToast({ message: __('Woohoo! Successfully reposted this claim.') });
        replace(getRedirect(contentUri, uri, redirectUri));
      });
    }
  }

  function cancelIt() {
    doClearRepostError();
    goBack();
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
      <ChannelSelector />

      <Card
        actions={
          <div>
            {uri && (
              <fieldset-section>
                <ClaimPreview key={uri} uri={uri} actions={''} showNullPlaceholder />
              </fieldset-section>
            )}
            {!uri && name && (
              <>
                <FormField
                  label={__('Content to repost')}
                  type="text"
                  name="content_url"
                  value={enteredContent}
                  error={contentError}
                  onChange={(event) => setEnteredContentUri(event.target.value)}
                  placeholder={__('Enter a name or %domain% URL', { domain: SITE_URL })}
                />
              </>
            )}

            {!uri && (
              <fieldset-section>
                <ClaimPreview key={contentUri} uri={contentUri} actions={''} type={'large'} showNullPlaceholder />
              </fieldset-section>
            )}

            <React.Fragment>
              <fieldset-section>
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  <fieldset-section>
                    <label htmlFor="auth_first_channel">
                      {repostNameError ? (
                        <span className="error__text">{repostNameError}</span>
                      ) : (
                        <span>
                          {__('Repost URL')}
                          <HelpLink href="https://lbry.com/faq/naming" />
                        </span>
                      )}
                    </label>
                    <div className="form-field__prefix">{repostUrlName}</div>
                  </fieldset-section>
                  <FormField
                    type="text"
                    name="repost_name"
                    value={enteredRepostName}
                    onChange={(event) => setEnteredRepostName(event.target.value)}
                    placeholder={__('MyFunName')}
                  />
                </fieldset-group>
              </fieldset-section>

              <FormField
                type="number"
                name="repost_bid"
                min="0"
                step="any"
                placeholder="0.123"
                className="form-field--price-amount"
                label={<LbcSymbol postfix={__('Support --[button to support a claim]--')} size={14} />}
                value={repostBid}
                error={repostBidError}
                helper={
                  <>
                    {__('Winning amount: %amount%', {
                      amount: Number(takeoverAmount).toFixed(2),
                    })}
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
                label={reposting ? __('Reposting') : __('Repost')}
                onClick={handleSubmit}
              />
              <Button button="link" label={__('Cancel')} onClick={cancelIt} />
            </div>
          </div>
        }
      />
    </>
  );
}

export default RepostCreate;
