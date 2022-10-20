import { URL, WEBPACK_WEB_PORT } from 'config';
import * as ICONS from 'constants/icons';

export const TEST = 'test';
export const LIVE = 'live';

const isDev = process.env.NODE_ENV !== 'production';

export const SUCCESS_ENDPOINT = '/$/settings/tip_account';
export const FAILURE_ENDPOINT = '/$/settings/tip_account';

const stripeRedirectPath = isDev ? 'http://localhost:' + WEBPACK_WEB_PORT : URL;
export const SUCCESS_REDIRECT_URL = stripeRedirectPath + SUCCESS_ENDPOINT;
export const FAILURE_REDIRECT_URL = stripeRedirectPath + FAILURE_ENDPOINT;

export const APIS_DOWN_ERROR_RESPONSE = 'There was an error from the server, please try again later';
export const CARD_SETUP_ERROR_RESPONSE = 'There was an error getting your card setup, please try again later';

export const CURRENCIES = Object.freeze({ EUR: 'EUR', USD: 'USD' });
export const CURRENCY = Object.freeze({
  [CURRENCIES.EUR]: { icon: ICONS.EURO, symbol: '€' },
  [CURRENCIES.USD]: { icon: ICONS.FINANCE, symbol: '$' },
});

export const STRIPE_BILLING_URL = 'https://billing.stripe.com/p/login/4gw14s1bLbBfdmoaEE';

export const STRIPE_ACCOUNT_DASHBOARD_URL = 'https://dashboard.stripe.com';
