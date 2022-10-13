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

declare type StripeAccountInfo = {
  business_profile: any,
  business_type: string,
  capabilities: any,
  charges_enabled: boolean,
  company: any,
  controller: any,
  country: string,
  created: number,
  default_currency: string,
  deleted: boolean,
  details_submitted: boolean,
  email: string,
  external_accounts: any,
  future_requirements: any,
  id: string,
  individual: any,
  metadata: any,
  object: string,
  payouts_enabled: true,
  requirements: any,
  settings: any,
  tos_acceptance: any,
  type: string,
};

declare type StripeCustomerStatus = {
  Customer: StripeCustomer,
  PaymentMethods: ?Array<StripePaymentMethod>,
};

declare type StripeAddressDetails = {
  city: string,
  country: string,
  line1: string,
  line2: string,
  postal_code: string,
  state: string,
};

declare type StripeCustomer = {
  address: StripeAddressDetails,
  balance: number,
  created: number,
  currency: string,
  default_source: ?{},
  deleted: boolean,
  delinquent: boolean,
  description: string,
  discount: ?{},
  email: string,
  id: string,
  invoice_prefix: string,
  invoice_settings: ?{},
  livemode: boolean,
  metadata: ?{},
  name: string,
  next_invoice_sequence: number,
  object: ?{},
  phone: string,
  preferred_locales: ?{},
  shipping: ?{},
  sources: ?{},
  subscriptions: ?{},
  tax: ?{},
  tax_exempt: string,
  tax_ids: ?{},
};

declare type StripePaymentMethod = {
  acss_debit: ?{},
  afterpay_clearpay: ?{},
  alipay: ?{},
  au_becs_debit: ?{},
  bacs_debit: ?{},
  bancontact: ?{},
  billing_details: {
    address: StripeAddressDetails,
    email: string,
    name: string,
    phone: string,
  },
  boleto: ?{},
  card: {
    brand: string,
    checks: {
      address_line1_check: string,
      address_postal_code_check: string,
      cvc_check: string,
    },
    country: string,
    exp_month: number,
    exp_year: number,
    fingerprint: string,
    funding: string,
    last4: number,
    networks: {
      available: [string],
      preferred: string,
    },
    three_d_secure_usage: {
      supported: boolean,
    },
    wallet: ?{},
    description: string,
    iin: string,
    issuer: string,
  },
  card_present: ?{},
  created: number,
  customer: StripeCustomer,
  eps: ?{},
  fpx: ?{},
  giropay: ?{},
  grabpay: ?{},
  id: string,
  ideal: ?{},
  interac_present: ?{},
  klarna: ?{},
  livemode: boolean,
  metadata: {},
  object: string,
  oxxo: ?{},
  p24: ?{},
  sepa_debit: ?{},
  sofort: ?{},
  type: string,
  wechat_pay: ?{},
};

declare type StripeAccountStatus = {
  account_info: StripeAccountInfo,
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
  customer: StripeCustomer,
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

declare type StripeCustomerPurchaseCostResponse = {
  stripe_cut: number,
  odysee_cut: number,
};

declare type StripeCustomerListParams = {
  environment?: ?string,
  type_filter?: string,
  target_claim_id_filter?: string,
  reference_claim_id_filter?: string,
  claim_id_filter?: string, // csv
};

declare type StripeTransaction = {
  name: string,
  currency: string,
  channel_name: string,
  channel_claim_id: string,
  source_claim_id: string,
  target_claim_id?: string,
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

declare type CurrencyOption = 'USD' | 'EUR';
