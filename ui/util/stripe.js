// @flow
import { STRIPE_PUBLIC_KEY } from 'config';
import * as STRIPE_CONSTS from 'constants/stripe';
import { PURCHASE_TAG, RENTAL_TAG } from 'constants/tags';
export function getStripeEnvironment() {
  if (STRIPE_PUBLIC_KEY) {
    if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
      return STRIPE_CONSTS.LIVE;
    } else {
      return STRIPE_CONSTS.TEST;
    }
  }
  return null;
}

// ****************************************************************************
// Purchase/rental
// ****************************************************************************

export const TO_SECONDS = { months: 2630000, weeks: 604800, days: 86400, hours: 3600 };

export function parseRentalTag(tags: ?Array<string>) {
  const prefix = `${RENTAL_TAG}:`; // 'c:rental:2.45:604800'
  const rentalTag = tags && tags.find((tag) => tag.startsWith(prefix));

  if (rentalTag) {
    const parts = rentalTag.substring(prefix.length).split(':');
    const price = parseFloat(parts[0]);
    const expirationTimeInSeconds = parseInt(parts[1]);

    if (Number.isFinite(price) && Number.isFinite(expirationTimeInSeconds)) {
      return { price, expirationTimeInSeconds };
    } else {
      return null; // invalid format
    }
  }

  return undefined; // no rental tag found
}

export function parsePurchaseTag(tags: ?Array<string>) {
  const prefix = `${PURCHASE_TAG}:`; // 'c:purchase:2.45'
  const purchaseTag = tags && tags.find((tag) => tag.startsWith(prefix));

  if (purchaseTag) {
    const parts = purchaseTag.substring(prefix.length).split(':');
    const price = parseFloat(parts[0]);

    if (Number.isFinite(price)) {
      return price;
    } else {
      return null; // invalid format
    }
  }

  return undefined; // no purchase tag found
}
