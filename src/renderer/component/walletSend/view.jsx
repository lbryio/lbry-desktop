// @flow
import React from 'react';
import Button from 'component/button';
import { Form, FormRow, FormField } from 'component/common/form';
import { Formik } from 'formik';
import { validateSendTx } from 'util/form-validation';

type DraftTransaction = {
  address: string,
  amount: number | string, // So we can use a placeholder in the input
};

type Props = {
  sendToAddress: DraftTransaction => void,
  balance: number,
};

class WalletSend extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values: DraftTransaction) {
    const { sendToAddress } = this.props;
    sendToAddress(values);
  }

  render() {
    const { balance } = this.props;

    return (
      <section className="card card--section">
        <div className="card__title">{__('Send Credits')}</div>
        <div className="card__content">
          <Formik
            initialValues={{
              address: '',
              amount: '',
            }}
            onSubmit={this.handleSubmit}
            validate={validateSendTx}
            render={({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormField
                    type="number"
                    name="amount"
                    label={__('Amount')}
                    postfix={__('LBC')}
                    className="input--price-amount"
                    min="0"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.amount}
                    error={
                      (!!values.amount && touched.amount && errors.amount) ||
                      (values.amount > balance && __('Not enough'))
                    }
                  />

                  <FormField
                    type="text"
                    name="address"
                    placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs"
                    className="input--address"
                    label={__('Recipient address')}
                    error={!!values.address && touched.address && errors.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                  />
                </FormRow>
                <div className="card__actions">
                  <Button
                    button="primary"
                    type="submit"
                    label={__('Send')}
                    disabled={
                      !values.address ||
                      !!Object.keys(errors).length ||
                      !(parseFloat(values.amount) > 0.0)
                    }
                  />
                </div>
              </Form>
            )}
          />
        </div>
      </section>
    );
  }
}

export default WalletSend;
