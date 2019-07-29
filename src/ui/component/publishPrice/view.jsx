// @flow
import React from 'react';
import { FormField, FormFieldPrice } from 'component/common/form';

type Props = {
  contentIsFree: boolean,
  fee: Fee,
  disabled: boolean,
  updatePublishForm: ({}) => void,
};

function PublishPrice(props: Props) {
  const { contentIsFree, fee, updatePublishForm, disabled } = props;

  return (
    <section className="card card--section">
      <FormField
        type="radio"
        name="content_free"
        label={__('Free')}
        checked={contentIsFree}
        disabled={disabled}
        onChange={() => updatePublishForm({ contentIsFree: true })}
      />

      <FormField
        type="radio"
        name="content_cost"
        label={__('Add a price to this file')}
        checked={!contentIsFree}
        disabled={disabled}
        onChange={() => updatePublishForm({ contentIsFree: false })}
      />
      {!contentIsFree && (
        <FormFieldPrice
          name="content_cost_amount"
          min="0"
          price={fee}
          onChange={newFee => updatePublishForm({ fee: newFee })}
        />
      )}
      {fee && fee.currency !== 'LBC' && (
        <p className="form-field__help">
          {__(
            'All content fees are charged in LBC. For non-LBC payment methods, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase.'
          )}
        </p>
      )}
    </section>
  );
}

export default PublishPrice;
