import * as STRIPE from 'constants/stripe';

declare type StripeState = {
  accountCheckFetchingIds: ClaimIds,
  canReceiveFiatTipsById: { [id: string]: boolean },
  accountStatus: ?StripeAccountStatus,
  accountLinkResponse: ?StripeAccountLink,
  accountTransactions: ?StripeTransactions,
  accountPaymentHistory: ?StripeTransactions,
  customerStatusFetching: ?boolean,
  customerStatus: any,
  customerSetupResponse: ?StripeCustomerSetupResponse,
};

declare type StripeAccountStatus = {
  account_info: any,
  charges_enabled: boolean,
  details_submitted: boolean,
  payouts_enabled: boolean,
  tos_accepted: boolean,
  total_cancelled: number,
  total_failed: number,
  total_intransit: number,
  total_paid: number,
  total_paid_out: number,
  total_pending: number,
  total_received_unpaid: number,
  total_tipped: number,
};

declare type StripeAccountLink = {
  created: number,
  expires_at: number,
  object: string,
  url: string,
};

declare type StripeCustomerSetupResponse = {
  application: ?{},
  cancellation_reason: string,
  client_secret: string,
  created: number,
  customer: {},
  description: string,
  id: string,
  is_first_setup: boolean,
  last_setup_error: ?string,
  latest_attempt: ?number,
  livemode: boolean,
  mandate: ?{},
  metadata: {},
  next_action: ?{},
  object: string,
  on_behalf_of: ?string,
  payment_method: ?{},
  payment_method_options: {},
  payment_method_types: Array<string>,
  single_use_mandate: ?boolean,
  status: string,
  usage: string,
};

declare type StripeTransaction = {
  name: string,
  currency: string,
  channel_name: string,
  channel_claim_id: string,
  source_claim_id: string,
  tipped_amount: number,
  transaction_fee: number,
  application_fee: number,
  received_amount: number,
  created_at: number,
  private_tip: string,
};
declare type StripeTransactions = Array<StripeTransaction>;

declare type StripeCardDetails = {
  paymentMethodId: string,
  cardName: string,
  brand: string,
  expiryYear: string,
  expiryMonth: string,
  lastFour: number,
  email: string,
};

declare type CurrencyOption = STRIPE.CURRENCIES.USD | STRIPE.CURRENCIES.EUR;
