// @flow
import React from 'react';
import { FormField, FormFieldPrice } from 'component/common/form';
// import Card from 'component/common/card';

type Props = {
  disabled: boolean,
  // --- redux ---
  contentIsFree: boolean,
  fee: Fee,
  restrictedToMemberships: ?string,
  updatePublishForm: ({}) => void,
};

function PublishPrice(props: Props) {
  const { contentIsFree, fee, updatePublishForm, disabled, restrictedToMemberships } = props;

  // If it's only restricted, the price can be added externally and they won't be able to change it
  const restrictedWithoutPrice = contentIsFree && restrictedToMemberships;

  return (
    <>
      <fieldset-section>
        <label className={disabled ? 'disabled' : ''}>{__('Price')}</label>
        <React.Fragment>
          <FormField
            type="radio"
            name="content_free"
            label={__('Free')}
            checked={contentIsFree}
            disabled={disabled || restrictedWithoutPrice}
            onChange={() => updatePublishForm({ contentIsFree: true })}
          />

          <FormField
            type="radio"
            name="content_cost"
            label={__('Add a price to this file')}
            checked={!contentIsFree}
            disabled={disabled || restrictedWithoutPrice}
            onChange={() => updatePublishForm({ contentIsFree: false })}
          />
          {!contentIsFree && (
            <FormFieldPrice
              name="content_cost_amount"
              min={0}
              price={fee}
              onChange={(newFee) => updatePublishForm({ fee: newFee })}
            />
          )}
          {fee && fee.currency !== 'LBC' && (
            <p className="form-field__help">
              {__(
                'All content fees are charged in LBRY Credits. For alternative payment methods, the number of LBRY Credits charged will be adjusted based on the value of LBRY Credits at the time of purchase.'
              )}
            </p>
          )}
          {restrictedWithoutPrice && (
            <div className="error__text">
              {__('You already have content restrictions enabled, disable them first in order to set a price.')}
            </div>
          )}
        </React.Fragment>
      </fieldset-section>
    </>
  );
}

export default PublishPrice;
