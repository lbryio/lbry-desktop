// @flow
import { STRIPE_PUBLIC_KEY } from 'config';
import * as STRIPE_CONSTS from 'constants/stripe';
import { PURCHASE_TAG, PURCHASE_TAG_OLD, RENTAL_TAG, RENTAL_TAG_OLD } from 'constants/tags';
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
  const prefixes = [`${RENTAL_TAG}:`, RENTAL_TAG_OLD];

  for (const prefix of prefixes) {
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
  }

  return undefined; // no rental tag found
}

export function parsePurchaseTag(tags: ?Array<string>) {
  const prefixes = [`${PURCHASE_TAG}:`, PURCHASE_TAG_OLD];

  for (const prefix of prefixes) {
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
  }

  return undefined; // no purchase tag found
}
