// @flow
import React from 'react';
import Button from 'component/link';
import { Form, FormRow, FormField } from 'component/common/form';
import { Formik } from 'formik';
import { validateSendTx } from 'util/form-validation';

type DraftTransaction = {
  address: string,
  amount: number | string, // So we can use a placeholder in the input
};

type Props = {
  sendToAddress: DraftTransaction => void,
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
    return (
      <section className="card card--section">
        <div className="card__title-primary">
          <h2>{__('Send Credits')}</h2>
        </div>
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
                    label={__('Amount')}
                    postfix={__('LBC')}
                    error={!!values.amount && touched.amount && errors.amount}
                    render={() => (
                      <input
                        className="input--price-amount"
                        type="number"
                        name="amount"
                        min="0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.amount}
                      />
                    )}
                  />

                  <FormField
                    label={__('Recipient address')}
                    error={!!values.address && touched.address && errors.address}
                    render={() => (
                      <input
                        className="input--address"
                        type="text"
                        name="address"
                        placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address}
                      />
                    )}
                  />
                </FormRow>
                <div className="card__actions">
                  <Button
                    type="submit"
                    icon="Send"
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
