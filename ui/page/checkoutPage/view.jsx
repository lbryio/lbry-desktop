// @flow
import * as React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';

export default function CheckoutPage() {
  return (
    <Page authPage className="main--auth-page">
      <Card
        title={__('Checkout')}
        subtitle={__('Your card contains 1 item.')}
        body={
          <div className="card--inline card--section card--highlighted">
            <strong>{__('lbry.tv Premium - 1 month')}</strong>
          </div>
        }
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('Checkout')} />
          </div>
        }
      />
    </Page>
  );
}
