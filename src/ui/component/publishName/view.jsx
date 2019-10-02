// @flow
import { CHANNEL_NEW, CHANNEL_ANONYMOUS, MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR } from 'constants/claim';
import React, { useState, useEffect } from 'react';
import { isNameValid } from 'lbry-redux';
import { FormField } from 'component/common/form';
import NameHelpText from './name-help-text';
import BidHelpText from './bid-help-text';
import Card from 'component/common/card';

type Props = {
  name: string,
  channel: string,
  uri: string,
  bid: number,
  balance: number,
  isStillEditing: boolean,
  myClaimForUri: ?StreamClaim,
  isResolvingUri: boolean,
  amountNeededForTakeover: number,
  prepareEdit: ({}, string) => void,
  updatePublishForm: ({}) => void,
};

function PublishName(props: Props) {
  const {
    name,
    channel,
    uri,
    isStillEditing,
    myClaimForUri,
    bid,
    isResolvingUri,
    amountNeededForTakeover,
    prepareEdit,
    updatePublishForm,
    balance,
  } = props;
  const [nameError, setNameError] = useState(undefined);
  const [bidError, setBidError] = useState(undefined);
  const previousBidAmount = myClaimForUri && Number(myClaimForUri.amount);

  function editExistingClaim() {
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
    }
  }

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
    const totalAvailableBidAmount = previousBidAmount + balance;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (totalAvailableBidAmount === bid) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    } else if (totalAvailableBidAmount < bid) {
      bidError = __('Deposit cannot be higher than your balance');
    } else if (bid <= MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    }

    setBidError(bidError);
  }, [bid, previousBidAmount, balance]);

  return (
    <Card
      actions={
        <React.Fragment>
          <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
            <fieldset-section>
              <label>{__('Name')}</label>
              <div className="form-field__prefix">{`lbry://${
                !channel || channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : `${channel}/`
              }`}</div>
            </fieldset-section>
            <FormField
              type="text"
              name="content_name"
              value={name}
              error={nameError}
              onChange={event => updatePublishForm({ name: event.target.value })}
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
          <FormField
            type="number"
            name="content_bid"
            min="0"
            step="any"
            placeholder="0.123"
            className="form-field--price-amount"
            label={__('Deposit (LBC)')}
            postfix="LBC"
            value={bid}
            error={bidError}
            disabled={!name}
            onChange={event => updatePublishForm({ bid: parseFloat(event.target.value) })}
            helper={
              <BidHelpText
                uri={uri}
                amountNeededForTakeover={amountNeededForTakeover}
                isResolvingUri={isResolvingUri}
              />
            }
          />
        </React.Fragment>
      }
    />
  );
}

export default PublishName;
