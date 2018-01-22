import React from 'react';
import { Form, FormRow, Submit } from 'component/form';
import { Lbryuri } from 'lbry-redux';

/* eslint-disable react/prop-types, react/jsx-no-bind */
class WalletSend extends React.PureComponent {
  handleSubmit() {
    const { amount, address, sendToAddress } = this.props;
    const validSubmit = parseFloat(amount) > 0.0 && address;

    if (validSubmit) {
      sendToAddress();
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { closeModal, modal, setAmount, setAddress, amount, address, error } = this.props;

    return (
      <section className="card">
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className="card__title-primary">
            <h3>{__('Send Credits')}</h3>
          </div>
          <div className="card__content">
            <FormRow
              label={__('Amount')}
              postfix={__('LBC')}
              step="any"
              min="0"
              type="number"
              placeholder="1.23"
              size="10"
              onChange={setAmount}
              value={amount}
            />
          </div>
          <div className="card__content">
            <FormRow
              label={__('Recipient Address')}
              placeholder="bbFxRyXXXXXXXXXXXZD8nE7XTLUxYnddTs"
              type="text"
              size="60"
              onChange={setAddress}
              value={address}
              regexp={Lbryuri.REGEXP_ADDRESS}
              trim
            />
            <div className="form-row-submit">
              <Submit label={__('Send')} disabled={!(parseFloat(amount) > 0.0) || !address} />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

export default WalletSend;
