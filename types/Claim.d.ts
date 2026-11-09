type Claim = StreamClaim | ChannelClaim | CollectionClaim;

type ChannelClaim = GenericClaim & {
  value: ChannelMetadata,
};

type CollectionClaim = GenericClaim & {
  value: CollectionMetadata,
};

type StreamClaim = GenericClaim & {
  value: StreamMetadata,
};

type GenericClaim = {
  address: string, // address associated with tx
  amount: string, // bid amount at time of tx
  canonical_url: string, // URL with short id, includes channel with short id
  claim_id: string, // unique claim identifier
  claim_sequence: number, // not being used currently
  claim_op: 'create' | 'update',
  confirmations: number,
  decoded_claim: boolean, // Not available currently https://github.com/lbryio/lbry/issues/2044
  timestamp?: number, // date of last transaction
  height: number, // block height the tx was confirmed
  is_channel_signature_valid?: boolean,
  is_my_output: boolean,
  name: string,
  normalized_name: string, // `name` normalized via unicode NFD spec,
  nout: number, // index number for an output of a tx
  permanent_url: string, // name + claim_id
  short_url: string, // permanent_url with short id, no channel
  txid: string, // unique tx id
  type: 'claim' | 'update' | 'support',
  value_type: 'stream' | 'channel' | 'collection',
  signing_channel?: ChannelClaim,
  reposted_claim?: GenericClaim,
  repost_channel_url?: string,
  repost_url?: string,
  repost_bid_amount?: string,
  purchase_receipt?: PurchaseReceipt,
  meta: {
    activation_height: number,
    claims_in_channel?: number,
    creation_height: number,
    creation_timestamp: number,
    effective_amount: string,
    expiration_height: number,
    is_controlling: boolean,
    support_amount: string,
    reposted: number,
    trending_global: number,
    trending_group: number,
    trending_local: number,
    trending_mixed: number,
  },
};

type GenericMetadata = {
  title?: string,
  description?: string,
  thumbnail?: {
    url?: string,
  },
  languages?: Array<string>,
  tags?: Array<string>,
  locations?: Array<ClaimLocation>,
};

type ChannelMetadata = GenericMetadata & {
  public_key: string,
  public_key_id: string,
  cover_url?: string,
  email?: string,
  website_url?: string,
  featured?: Array<string>,
};

type CollectionMetadata = GenericMetadata & {
  claims: Array<string>,
};

type StreamMetadata = GenericMetadata & {
  license?: string, // License "title" ex: Creative Commons, Custom copyright
  license_url?: string, // Link to full license
  release_time?: number, // linux timestamp
  author?: string,

  source: {
    sd_hash: string,
    media_type?: string,
    hash?: string,
    name?: string, // file name
    size?: number, // size of file in bytes
  },

  // Only exists if a stream has a fee
  fee?: Fee,

  stream_type: 'video' | 'audio' | 'image' | 'software',
  // Below correspond to `stream_type`
  video?: {
    duration: number,
    height: number,
    width: number,
  },
  audio?: {
    duration: number,
  },
  image?: {
    height: number,
    width: number,
  },
  software?: {
    os: string,
  },
};

// Flow name: Location — renamed to avoid colliding with the DOM's Location type
type ClaimLocation = {
  latitude?: number,
  longitude?: number,
  country?: string,
  state?: string,
  city?: string,
  code?: string,
};

type Fee = {
  amount: string,
  currency: string,
  address: string,
};

type PurchaseReceipt = {
  address: string,
  amount: string,
  claim_id: string,
  confirmations: number,
  height: number,
  nout: number,
  timestamp: number,
  txid: string,
  type: 'purchase',
};

type ClaimErrorCensor = {
  address: string,
  amount: string,
  canonical_url: string,
  claim_id: string,
  claim_op: string,
  confirmations: number,
  has_signing_key: boolean,
  height: number,
  meta: {
    activation_height: number,
    claims_in_channel: number,
    creation_height: number,
    creation_timestamp: number,
    effective_amount: string,
    expiration_height: number,
    is_controlling: boolean,
    reposted: number,
    support_amount: string,
    take_over_height: number,
  },
  name: string,
  normalized_name: string,
  nout: number,
  permanent_url: string,
  short_url: string,
  timestamp: number,
  txid: string,
  type: string,
  value: {
    public_key: string,
    public_key_id: string,
  },
  value_type: string,
};

type ClaimActionResolveInfo = {
  [key: string]: {
    stream: StreamClaim | null | undefined,
    channel: ChannelClaim | null | undefined,
    claimsInChannel: number | null | undefined,
    collection: CollectionClaim | null | undefined,
    errorCensor: ClaimErrorCensor | null | undefined,
  },
};

type ChannelUpdateParams = {
  claim_id: string,
  bid?: string,
  title?: string,
  cover_url?: string,
  thumbnail_url?: string,
  description?: string,
  website_url?: string,
  email?: string,
  tags?: Array<string>,
  replace?: boolean,
  languages?: Array<string>,
  locations?: Array<string>,
  blocking?: boolean,
};

type ChannelPublishParams = {
  name: string,
  bid: string,
  blocking?: true,
  title?: string,
  cover_url?: string,
  thumbnail_url?: string,
  description?: string,
  website_url?: string,
  email?: string,
  tags?: Array<string>,
  languages?: Array<string>,
};

type CollectionUpdateParams = {
  claim_id: string,
  claim_ids?: Array<string>,
  bid?: string,
  title?: string,
  cover_url?: string,
  thumbnail_url?: string,
  description?: string,
  website_url?: string,
  email?: string,
  tags?: Array<string>,
  replace?: boolean,
  languages?: Array<string>,
  locations?: Array<string>,
  blocking?: boolean,
};

type CollectionPublishParams = {
  name: string,
  bid: string,
  claim_ids: Array<string>,
  blocking?: true,
  title?: string,
  thumbnail_url?: string,
  description?: string,
  tags?: Array<string>,
  languages?: Array<string>,
};
