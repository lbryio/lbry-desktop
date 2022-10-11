// @flow
import * as React from 'react';

import './style.scss';
import PreorderAndPurchaseButton from 'component/preorderAndPurchaseContentButton';

type RentalTagParams = { price: number, expirationTimeInSeconds: number };

type Props = {
  uri: string,
  // --- redux ---
  rentalTag: RentalTagParams,
};

const PaidContentOverlay = (props: Props) => {
  const { uri } = props;

  return (
    <div className="paid-content-overlay">
      <div className="paid-content-overlay__body">
        <PreorderAndPurchaseButton uri={uri} type="overlay" />
      </div>
    </div>
  );
};

export default PaidContentOverlay;
