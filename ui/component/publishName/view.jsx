// @flow
import { CHANNEL_NEW, CHANNEL_ANONYMOUS, MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';
import React, { useState, useEffect } from 'react';
import { isNameValid } from 'lbry-redux';
import { FormField } from 'component/common/form';
import NameHelpText from './name-help-text';
import BidHelpText from './bid-help-text';
// import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  name: string,
  channel: string,
  uri: string,
  bid: number,
  balance: number,
  disabled: boolean,
  isStillEditing: boolean,
  myClaimForUri: ?StreamClaim,
  isResolvingUri: boolean,
  amountNeededForTakeover: number,
  prepareEdit: ({}, string) => void,
  updatePublishForm: ({}) => void,
  autoPopulateName: boolean,
  setAutoPopulateName: boolean => void,
  nameOnly: boolean,
};

function PublishName(props: Props) {
  const {
    name,
    channel,
    uri,
    disabled,
    isStillEditing,
    myClaimForUri,
    bid,
    isResolvingUri,
    amountNeededForTakeover,
    prepareEdit,
    updatePublishForm,
    balance,
    autoPopulateName,
    setAutoPopulateName,
    nameOnly,
  } = props;
  const [nameError, setNameError] = useState(undefined);
  const [bidError, setBidError] = useState(undefined);
  const [hasFocused, setHasFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);
  const previousBidAmount = myClaimForUri && Number(myClaimForUri.amount);

  function editExistingClaim() {
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
    }
  }

  function handleNameChange(event) {
    updatePublishForm({ name: event.target.value });

    if (autoPopulateName) {
      setAutoPopulateName(false);
    }
  }

  useEffect(() => {
    const hasName = name && name.trim() !== '';
    // Enable name autopopulation from title
    if (!hasName && !autoPopulateName && setAutoPopulateName) {
      setAutoPopulateName(true);
    }
  }, [name, autoPopulateName, setAutoPopulateName]);

  useEffect(() => {
    let nameError;
    if (!name) {
      nameError = __('A name is required');
    } else if (!isNameValid(name, false)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);

  useEffect(() => {
    const totalAvailableBidAmount = previousBidAmount ? previousBidAmount + balance : balance;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (bid < MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    } else if (totalAvailableBidAmount < bid) {
      bidError = __('Deposit cannot be higher than your available balance: %balance%', {
        balance: totalAvailableBidAmount,
      });
    } else if (totalAvailableBidAmount <= bid + 0.05) {
      bidError = __('Please decrease your deposit to account for transaction fees or acquire more LBRY Credits.');
    }

    setBidError(bidError);
    updatePublishForm({ bidError: bidError });
  }, [bid, previousBidAmount, balance, updatePublishForm]);

  const namePart = (
    <>
      <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
        <fieldset-section>
          <label>{__('Name')}</label>
          <div className="form-field__prefix">{`odysee.com/${
            !channel || channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : `${channel}/`
          }`}</div>
        </fieldset-section>
        <FormField
          type="text"
          name="content_name"
          value={name}
          disabled={disabled}
          error={hasFocused && hasBlurred && nameError}
          onChange={handleNameChange}
          onFocus={() => setHasFocused(true)}
          onBlur={() => setHasBlurred(true)}
        />
      </fieldset-group>
      <div className="form-field__help">
        <NameHelpText
          uri={uri}
          isStillEditing={isStillEditing}
          myClaimForUri={myClaimForUri}
          onEditMyClaim={editExistingClaim}
        />
      </div>
    </>
  );

  if (nameOnly) {
    return namePart;
  }

  return (
    <FormField
      type="number"
      name="content_bid"
      min="0"
      step="any"
      placeholder="0.123"
      className="form-field--price-amount"
      label={<LbcSymbol postfix={__('Deposit')} size={12} />}
      value={bid}
      error={bidError}
      disabled={!name}
      onChange={event => updatePublishForm({ bid: parseFloat(event.target.value) })}
      onWheel={e => e.stopPropagation()}
      helper={
        <BidHelpText
          uri={'lbry://' + name}
          amountNeededForTakeover={amountNeededForTakeover}
          isResolvingUri={isResolvingUri}
        />
      }
    />
  );
}

export default PublishName;
