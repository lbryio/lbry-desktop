// @flow
import { STRIPE_PUBLIC_KEY } from 'config';
import * as STRIPE_CONSTS from 'constants/stripe';
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
