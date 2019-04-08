// @flow

export type Certificate = GenericClaim & {
  value: {
    channel: ChannelMetadata,
  },
};

export type Claim = GenericClaim & {
  signature_is_valid?: boolean, // Is claim associated with valid channel private key
  value: {
    stream?: StreamMetadata,
  },
};

type GenericClaim = {
  address: string, // address associated with tx
  amount: number, // bid amount at time of tx
  claim_id: string, // unique claim identifier
  claim_sequence: number,
  decoded_claim: boolean, // claim made in accordance with sdk protobuf types
  depth: number, // confirmations since tx
  effective_amount: number, // bid amount + supports
  has_signature: boolean,
  height: number, // block height the tx was confirmed
  hex: string, // `value` hex encoded
  name: string,
  normalized_name: string, // `name` normalized via unicode NFD spec,
  nout: number, // index number for an output of a tx
  permanent_url: string, // name + claim_id
  supports: Array<{}>, // TODO: add support type
  txid: string, // unique tx id
  valid_at_height?: number, // BUG: this should always exist https://github.com/lbryio/lbry/issues/1728
};

type GenericMetadata = {
  title?: string,
  description?: string,
  thumbnail_url?: string,
  languages?: Array<string>,
  tags?: Array<string>,
  locations?: Array<Locations>,
};

export type ChannelMetadata = GenericMetadata & {
  public_key: string,
  cover_url?: string,
  contact_email?: string,
  homepage_url?: string,
};

export type StreamMetadata = GenericMetadata & {
  sd_hash: string,
  file_hash: string,
  media_type?: string, // TODO: will this be an object?

  license?: string, // License "title" ex: Creative Commons, Custom copyright
  license_url?: string, // Link to full license
  release_time?: number, // linux timestamp
  author?: string,

  // Only exists if a stream has a fee
  fee?: {
    amount: number, // should be a string https://github.com/lbryio/lbry/issues/1576
    currency: string,
    address: string,
  },

  // Below correspond to `media_type`
  video?: {
    duration: number,
    height: number,
    width: number,
  },
  audio?: {
    duration: number,
    height: number,
    width: number,
  },
  image?: {
    height: number,
    width: number,
  },
};

type Locations =
  | { latitude: number, longitude: number }
  | {
      country?: string,
      state?: string,
      code?: string,
    };
