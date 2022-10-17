declare type MembershipBuyParams = {
  membership_id: number,
  channel_id?: string,
  channel_name?: string,
  price_id: string,
};

declare type MembershipListParams = {
  channel_id: string,
  channel_name: string,
};

// -- CreatorMembership: data the creator sees for a given membership
declare type CreatorMembership = {
  HasSubscribers: boolean,
  Membership: MembershipDetails,
  Perks: MembershipOdyseePerks,
  Prices?: Array<StripePriceDetails>,
  NewPrices: Array<MembershipNewStripePriceDetails>,
};
declare type CreatorMemberships = Array<CreatorMembership>;

// -- MembershipTier: data the supporter sees for a given membership
declare type MembershipTier = {
  Membership: Membership,
  MembershipDetails: MembershipDetails,
  Subscription: MembershipSubscriptionDetails,
  Perks: MembershipOdyseePerks,
};
declare type MembershipTiers = Array<MembershipTier>;

declare type Membership = {
  name: ?string,
  auto_renew: boolean,
  badge: ?string,
  channel_id: string,
  channel_name: string,
  created_at: string,
  expires: string,
  handle: string,
  id: number,
  is_live: boolean,
  membership_id: number,
  membership_price_id: number,
  show_public_support: boolean,
  stripe_sub_id: string,
  term: string,
  tx_id: ?number,
  updated_at: string,
  user_id: number,
  verified: boolean,
};

declare type MembershipDetails = {
  activated: boolean,
  badge_url: string,
  channel_id: string,
  channel_name: string,
  created_at: string,
  description: string,
  id: number,
  is_live: boolean,
  level: number,
  name: string,
  stripe_product_id: string,
  type: string,
  updated_at: string,
  user_id: number,
};

declare type MembershipSubscriptionDetails = {
  application_fee_percent: number,
  automatic_tax: { enabled: boolean },
  billing_cycle_anchor: number,
  billing_thresholds: ?{},
  cancel_at: number,
  cancel_at_period_end: boolean,
  canceled_at: number,
  collection_method: string,
  created: number,
  current_period_end: number,
  current_period_start: number,
  customer: {},
  days_until_due: number,
  default_payment_method: {},
  default_source: ?{},
  default_tax_rates: Array<any>,
  discount: ?number,
  ended_at: number,
  id: string,
  items: {},
  latest_invoice: {},
  livemode: boolean,
  metadata: {},
  next_pending_invoice_item_invoice: number,
  object: string,
  on_behalf_of: ?string,
  pause_collection: {},
  payment_settings: {},
  pending_invoice_item_interval: {},
  pending_setup_intent: ?{},
  pending_update: ?{},
  plan: {
    currency: string,
    amount: number,
    interval: string,
  },
  quantity: number,
  schedule: ?{},
  start_date: number,
  status: string,
  transfer_data: ?{},
  trial_end: number,
  trial_start: number,
};

declare type MembershipOdyseePerk = {
  created_at: string,
  description: string,
  id: number,
  image_url: ?string,
  is_odysee_perk: boolean,
  name: string,
  updated_at: string,
};
declare type MembershipOdyseePerks = Array<MembershipOdyseePerk>;

declare type MembershipNewStripePriceDetails = {
  Price: MembershipPriceDetails,
  StripePrice: StripePriceDetails,
  creator_receives_amount: number,
  client_pays: number,
  fees: {
    stripe_fee: number,
    odysee_fee: number,
  },
};

declare type MembershipPriceDetails = {
  amount: number,
  created_at: string,
  currency: string,
  id: number,
  is_annual: boolean,
  membership_id: number,
  stripe_price_id: string,
  stripe_product_id: string,
  updated_at: string,
};

declare type StripePriceDetails = {
  active: boolean,
  billing_scheme: string,
  created: number,
  currency: string,
  deleted: boolean,
  id: string,
  livemode: boolean,
  lookup_key: string,
  metadata: {},
  nickname: string,
  object: string,
  product: {
    active: boolean,
    attributes: ?{},
    caption: string,
    created: number,
    deactivate_on: ?string,
    deleted: boolean,
    description: string,
    id: string,
    images: ?{},
    livemode: boolean,
    metadata: ?{},
    name: string,
    object: string,
    package_dimensions: ?{},
    shippable: boolean,
    statement_descriptor: string,
    tax_code: ?{},
    type: string,
    unit_label: string,
    updated: number,
    url: string,
  },
  recurring: {
    aggregate_usage: string,
    interval: string,
    interval_count: number,
    trial_period_days: number,
    usage_type: string,
  },
  tax_behavior: string,
  tiers: ?{},
  tiers_mode: string,
  transform_quantity: ?number,
  type: string,
  unit_amount: number,
  unit_amount_decimal: string,
};

declare type MembershipAddTierParams = {
  channel_name: string,
  channel_id: string,
  name: string,
  description: string,
  currency: string,
  amount: number,
  perks: string, // csv
  old_stripe_price?: ?string, // price id
  membership_id?: ?number,
};

declare type MembershipMineDataByCreatorId = { [id: ClaimId]: MembershipTiers };

declare type MembershipIdByChannelId = {
  [channelId: string]: string,
};
declare type ChannelMembershipsByCreatorId = {
  [creatorId: string]: Array<MembershipIdByChannelId>,
};

declare type MembershipSupporter = {
  ChannelBeingSupported: string,
  ChannelName: string,
  ChannelID: string,
  Interval: string,
  JoinedAtTime: string,
  MembershipName: string,
  Price: number,
};
declare type SupportersList = Array<MembershipSupporter>;

declare type MembershipContentResponse = Array<MembershipContentResponseItem>;
declare type MembershipContentResponseItem = {
  channel_id: string,
  claim_id: string,
  membership_id: number,
};
