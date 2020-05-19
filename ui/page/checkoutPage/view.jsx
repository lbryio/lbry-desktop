// @flow
import * as React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import Card from 'component/common/card';
import CreditCards from './credit-card-logos.png';

export default function CheckoutPage() {
  return (
    <Page authPage className="main--auth-page">
      <Card
        title={__('Checkout')}
        subtitle={__('Your cart contains 1 item.')}
        body={
          <div className="card--inline card--section card--highlighted">
            <strong>{__('lbry.tv Premium - 1 month')}</strong>
            <div>$5 per month</div>
          </div>
        }
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('Checkout')} />
            <div>
              <img src={CreditCards} style={{ height: '2rem' }} />
            </div>
          </div>
        }
      />
    </Page>
  );
}
