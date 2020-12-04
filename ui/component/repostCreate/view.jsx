// @flow

import * as ICONS from 'constants/icons';
import { CHANNEL_NEW, MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';
import React from 'react';
import { useHistory } from 'react-router';
import Card from 'component/common/card';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import { FormField } from 'component/common/form';
import { parseURI, isNameValid, creditsToString } from 'lbry-redux';
import usePersistedState from 'effects/use-persisted-state';
import I18nMessage from 'component/i18nMessage';
import analytics from 'analytics';
import LbcSymbol from 'component/common/lbc-symbol';
import ClaimPreview from 'component/claimPreview';
import { SITE_NAME } from 'config';

type Props = {
  doToast: ({ message: string }) => void,
  doClearRepostError: () => void,
  doRepost: StreamRepostOptions => Promise<*>,
  title: string, //
  claim?: StreamClaim,
  enteredContentClaim?: StreamClaim,
  balance: number,
  channels: ?Array<ChannelClaim>,
  doCheckPublishNameAvailability: string => Promise<*>,
  error: ?string,
  reposting: boolean,
  uri: string,
  name: string,
  contentUri: string,
  setRepostUri: string => void,
  setContentUri: string => void,
  doCheckPendingClaims: () => void,
  redirectUri?: string,
  passedRepostAmount: number,
  enteredRepostAmount: number,
  isResolvingPassedRepost: boolean,
  isResolvingEnteredRepost: boolean,
};

function RepostCreate(props: Props) {
  const {
    doToast,
    doClearRepostError,
    doRepost,
    claim,
    enteredContentClaim,
    balance,
    channels,
    reposting,
    doCheckPublishNameAvailability,
    uri,
    name,
    contentUri,
    setRepostUri,
    setContentUri,
    doCheckPendingClaims,
    redirectUri,
    enteredRepostAmount,
    passedRepostAmount,
    isResolvingPassedRepost,
    isResolvingEnteredRepost,
  } = props;
  const defaultName = name || (claim && claim.name) || '';
  const contentClaimId = claim && claim.claim_id;
  const enteredClaimId = enteredContentClaim && enteredContentClaim.claim_id;

  const [repostChannel, setRepostChannel] = usePersistedState('repost-channel', 'anonymous');
  const [repostBid, setRepostBid] = React.useState(0.01);
  const [enteredRepostName, setEnteredRepostName] = React.useState(defaultName);
  const [enteredContentUri, setEnteredContentUri] = React.useState();
  const [takeoverAmount, setTakeoverAmount] = React.useState(0);

  const [available, setAvailable] = React.useState(true);
  const { replace, goBack } = useHistory();
  console.log('isR', isResolvingEnteredRepost, isResolvingPassedRepost);
  const resolvingRepost = isResolvingEnteredRepost || isResolvingPassedRepost;

  let repostBidError;
  if (repostBid === 0) {
    repostBidError = __('Deposit cannot be 0');
  } else if (balance === repostBid) {
    repostBidError = __('Please decrease your deposit to account for transaction fees');
  } else if (balance < repostBid) {
    repostBidError = __('Deposit cannot be higher than your balance');
  } else if (repostBid < MINIMUM_PUBLISH_BID) {
    repostBidError = __('Your deposit must be higher');
  }

  let repostNameError;
  if (!enteredRepostName) {
    repostNameError = __('A name is required');
  } else if (!isNameValid(enteredRepostName, false)) {
    repostNameError = INVALID_NAME_ERROR;
  } else if (!available) {
    repostNameError = __('You already have a claim with this name.');
  }

  const repostUrlName = `lbry://${
    !repostChannel || repostChannel === CHANNEL_NEW || repostChannel === 'anonymous' ? '' : `${repostChannel}/`
  }`;

  const channelStrings = channels && channels.map(channel => channel.permanent_url).join(',');
  React.useEffect(() => {
    if (!repostChannel && channelStrings) {
      const channels = channelStrings.split(',');
      const newChannelUrl = channels[0];
      const { claimName } = parseURI(newChannelUrl);
      setRepostChannel(claimName);
    }
  }, [channelStrings]);

  React.useEffect(() => {
    if (enteredRepostName && isNameValid(enteredRepostName, false)) {
      doCheckPublishNameAvailability(enteredRepostName).then(r => setAvailable(r));
    }
  }, [enteredRepostName, doCheckPublishNameAvailability]);

  React.useEffect(() => {
    if (enteredRepostAmount) {
      setTakeoverAmount(enteredRepostAmount);
    } else if (passedRepostAmount && enteredRepostName && enteredRepostName === name) {
      setTakeoverAmount(passedRepostAmount);
    } else {
      setTakeoverAmount(0);
    }
  }, [setTakeoverAmount, enteredRepostAmount, passedRepostAmount, name, enteredRepostName, repostNameError]);

  React.useEffect(() => {
    if (enteredContentUri) {
      let isValid = false;
      try {
        parseURI(enteredContentUri);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      if (isValid) {
        setContentUri(enteredContentUri);
      }
    }
  }, [enteredContentUri, setContentUri, parseURI]);

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

  function handleSubmit() {
    const channelToRepostTo = channels && channels.find(channel => channel.name === repostChannel);
    if (enteredRepostName && repostBid && repostClaimId) {
      doRepost({
        name: enteredRepostName,
        bid: creditsToString(repostBid),
        channel_id: channelToRepostTo ? channelToRepostTo.claim_id : undefined,
        claim_id: repostClaimId,
      }).then((repostClaim: StreamClaim) => {
        doCheckPendingClaims();
        analytics.apiLogPublish(repostClaim);
        doToast({ message: __('Woohoo! Successfully reposted this claim.') });
        replace(redirectUri || `/${contentUri}`);
      });
    }
  }

  function cancelIt() {
    doClearRepostError();
    goBack();
  }

  return (
    <>
      <span className="claim-list__header-action-text">Repost content and channels to help people discover them</span>
      <Card
        actions={
          <div>
            {name && (
              <>
                <FormField
                  label={'Content to repost'}
                  type="text"
                  name="repost_url"
                  value={enteredContentUri}
                  error={false}
                  onChange={event => setEnteredContentUri(event.target.value)}
                />
                <div className="form-field__help">{`Enter a name or copy and paste a ${
                  SITE_NAME === 'lbry.tv' ? SITE_NAME : `LBRY or ${SITE_NAME}`
                } URL`}</div>
              </>
            )}
            <fieldset-section>
              {(uri || contentUri) && (
                <ClaimPreview
                  key={uri || contentUri}
                  uri={uri || contentUri}
                  actions={''}
                  type={'large'}
                  showNullPlaceholder
                />
              )}
              {!uri && !contentUri && (
                <ClaimPreview actions={''} type={'large'} placeholder={'loading'} showNullPlaceholder />
              )}
            </fieldset-section>

            <React.Fragment>
              <fieldset-section>
                <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                  <fieldset-section>
                    <label>{__('Repost url')}</label>
                    <div className="form-field__prefix">{repostUrlName}</div>
                  </fieldset-section>
                  <FormField
                    type="text"
                    name="repost_name"
                    value={enteredRepostName}
                    error={repostNameError}
                    onChange={event => setEnteredRepostName(event.target.value)}
                  />
                </fieldset-group>
              </fieldset-section>
              <div className="form-field__help">
                <I18nMessage
                  tokens={{
                    lbry_naming_link: (
                      <Button button="link" label={__('community name')} href="https://lbry.com/faq/naming" />
                    ),
                  }}
                >
                  Change this to repost to a different %lbry_naming_link%.
                </I18nMessage>
              </div>

              <SelectChannel
                label={__('Channel to repost on')}
                // hideAnon
                hideNew
                channel={repostChannel}
                onChannelChange={newChannel => setRepostChannel(newChannel)}
              />

              <FormField
                type="number"
                name="repost_bid"
                min="0"
                step="any"
                placeholder="0.123"
                className="form-field--price-amount"
                label={<LbcSymbol postfix={__('Stake')} size={14} />}
                value={repostBid}
                error={repostBidError}
                helper={__('Bid more than %amount% Credits to take over.', {
                  amount: repostNameError ? 0 : Number(takeoverAmount).toFixed(2),
                })}
                disabled={!enteredRepostName || resolvingRepost}
                onChange={event => setRepostBid(parseFloat(event.target.value))}
                onWheel={e => e.stopPropagation()}
              />
            </React.Fragment>

            <div className="section__actions">
              <Button
                icon={ICONS.REPOST}
                disabled={reposting || repostBidError || repostNameError}
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
