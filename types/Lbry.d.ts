type StatusResponse = {
  blob_manager: {
    finished_blobs: number,
  },
  blockchain_headers: {
    download_progress: number,
    downloading_headers: boolean,
  },
  dht: {
    node_id: string,
    peers_in_routing_table: number,
  },
  hash_announcer: {
    announce_queue_size: number,
  },
  installation_id: string,
  is_running: boolean,
  skipped_components: Array<string>,
  startup_status: {
    blob_manager: boolean,
    blockchain_headers: boolean,
    database: boolean,
    dht: boolean,
    exchange_rate_manager: boolean,
    hash_announcer: boolean,
    peer_protocol_server: boolean,
    stream_manager: boolean,
    upnp: boolean,
    wallet: boolean,
  },
  stream_manager: {
    managed_files: number,
  },
  upnp: {
    aioupnp_version: string,
    dht_redirect_set: boolean,
    external_ip: string,
    gateway: string,
    peer_redirect_set: boolean,
    redirects: {},
  },
  wallet: {
    connected: string,
    best_blockhash: string,
    blocks: number,
    blocks_behind: number,
    is_encrypted: boolean,
    is_locked: boolean,
    headers_synchronization_progress: number,
    available_servers: number,
  } | null | undefined,
};

type VersionResponse = {
  build: string,
  lbrynet_version: string,
  os_release: string,
  os_system: string,
  platform: string,
  processor: string,
  python_version: string,
};

type BalanceResponse = {
  available: string,
  reserved: string,
  reserved_subtotals: {
    claims: string,
    supports: string,
    tips: string,
  } | null | undefined,
  total: string,
};

type ResolveResponse = {
  // Keys are the url(s) passed to resolve
  [key: string]: { error?: {}, stream?: StreamClaim, channel?: ChannelClaim, collection?: CollectionClaim, claimsInChannel?: number },
};

type GetResponse = FileListItem & { error?: string };

type GenericTxResponse = {
  height: number,
  hex: string,
  inputs: Array<{}>,
  outputs: Array<{}>,
  total_fee: string,
  total_input: string,
  total_output: string,
  txid: string,
};

type PublishResponse = GenericTxResponse & {
  // Only first value in outputs is a claim
  // That's the only value we care about
  outputs: Array<Claim>,
};

type ClaimSearchResponse = {
  items: Array<Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type ClaimListResponse = {
  items: Array<ChannelClaim | Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type ChannelCreateResponse = GenericTxResponse & {
  outputs: Array<ChannelClaim>,
};

type ChannelUpdateResponse = GenericTxResponse & {
  outputs: Array<ChannelClaim>,
};

type CommentCreateResponse = LbryComment;
type CommentUpdateResponse = LbryComment;

type MyReactions = {
  // Keys are the commentId
  [key: string]: Array<string>,
};

type OthersReactions = {
  // Keys are the commentId
  [key: string]: {
    // Keys are the reaction_type, e.g. 'like'
    [key: string]: number,
  },
};

type CommentReactListResponse = {
  my_reactions: Array<MyReactions>,
  others_reactions: Array<OthersReactions>,
};

type CommentHideResponse = {
  // keyed by the CommentIds entered
  [key: string]: { hidden: boolean },
};

// NOTE(ts-migration): CommentPinResponse was declared in both flow-typed/Lbry.js and
// flow-typed/Comment.js (Flow allowed the duplicate; TypeScript does not). The active
// declaration lives in types/Comment.d.ts, so this copy is commented out.
// type CommentPinResponse = {
//   // keyed by the CommentIds entered
//   items: LbryComment,
// };

type CommentAbandonResponse = {
  // keyed by the CommentId given
  abandoned: boolean,
};

type ChannelListResponse = {
  items: Array<ChannelClaim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type ChannelSignResponse = {
  signature: string,
  signing_ts: string,
};

type CollectionCreateResponse = {
  outputs: Array<Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
}

type CollectionListResponse = {
  items: Array<Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type CollectionResolveResponse = {
  items: Array<Claim>,
  total_items: number,
};

type CollectionResolveOptions = {
  claim_id: string,
};

type CollectionListOptions = {
  page: number,
  page_size: number,
  resolve?: boolean,
};

type FileListResponse = {
  items: Array<FileListItem>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type TxListResponse = {
  items: Array<Transaction>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type SupportListResponse = {
  items: Array<Support>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type BlobListResponse = { items: Array<string> };

type WalletListResponse = Array<{
  id: string,
  name: string,
}>;

type WalletStatusResponse = {
  is_encrypted: boolean,
  is_locked: boolean,
  is_syncing: boolean,
};

type SyncApplyResponse = {
  hash: string,
  data: string,
};

type SupportAbandonResponse = GenericTxResponse;

type StreamListResponse = {
  items: Array<StreamClaim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type StreamRepostOptions = {
  name: string,
  bid: string,
  claim_id: string,
  channel_id?: string,
};

type StreamRepostResponse = GenericTxResponse;

type PurchaseListResponse = {
  items: Array<PurchaseReceipt & { claim: StreamClaim }>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

type PurchaseListOptions = {
  page: number,
  page_size: number,
  resolve: boolean,
  claim_id?: string,
  channel_id?: string,
};

//
// Types used in the generic Lbry object that is exported
//
type LbryTypes = {
  isConnected: boolean,
  connectPromise: any, // null |
  connect: () => any, // void | Promise<any> ?
  daemonConnectionString: string,
  alternateConnectionString: string,
  methodsUsingAlternateConnectionString: Array<string>,
  apiRequestHeaders: { [key: string]: string },
  setDaemonConnectionString: (value: string) => void,
  setApiHeader: (key: string, value: string) => void,
  unsetApiHeader: (key: string) => void,
  overrides: { [key: string]: Function | null | undefined },
  setOverride: (methodName: string, newMethod: Function) => void,
  // getMediaType: (contentType?: string | null, fileName?: string | null) => string,

  // Lbry Methods
  stop: () => Promise<string>,
  status: () => Promise<StatusResponse>,
  version: () => Promise<VersionResponse>,
  resolve: (params: {}) => Promise<ResolveResponse>,
  get: (params: {}) => Promise<GetResponse>,
  publish: (params: {}) => Promise<PublishResponse>,

  claim_search: (params: {}) => Promise<ClaimSearchResponse>,
  claim_list: (params: {}) => Promise<ClaimListResponse>,
  channel_create: (params: {}) => Promise<ChannelCreateResponse>,
  channel_update: (params: {}) => Promise<ChannelUpdateResponse>,
  channel_import: (params: {}) => Promise<string>,
  channel_list: (params: {}) => Promise<ChannelListResponse>,
  channel_sign: (params: {}) => Promise<ChannelSignResponse>,
  stream_abandon: (params: {}) => Promise<GenericTxResponse>,
  stream_list: (params: {}) => Promise<StreamListResponse>,
  channel_abandon: (params: {}) => Promise<GenericTxResponse>,
  support_create: (params: {}) => Promise<GenericTxResponse>,
  support_list: (params: {}) => Promise<SupportListResponse>,
  support_abandon: (params: {}) => Promise<SupportAbandonResponse>,
  stream_repost: (params: StreamRepostOptions) => Promise<StreamRepostResponse>,
  purchase_list: (params: PurchaseListOptions) => Promise<PurchaseListResponse>,
  collection_resolve: (params: CollectionResolveOptions) => Promise<CollectionResolveResponse>,
  collection_list: (params: CollectionListOptions) => Promise<CollectionListResponse>,
  collection_create: (params: {}) => Promise<CollectionCreateResponse>,
  collection_update: (params: {}) => Promise<CollectionCreateResponse>,

  // File fetching and manipulation
  file_list: (params: {}) => Promise<FileListResponse>,
  file_delete: (params: {}) => Promise<boolean>,
  blob_delete: (params: {}) => Promise<string>,
  blob_list: (params: {}) => Promise<BlobListResponse>,
  file_set_status: (params: {}) => Promise<any>,
  file_reflect: (params: {}) => Promise<any>,

  // Preferences
  preference_get: (params?: {}) => Promise<any>,
  preference_set: (params: {}) => Promise<any>,

  // Commenting
  comment_update: (params: {}) => Promise<CommentUpdateResponse>,
  comment_hide: (params: {}) => Promise<CommentHideResponse>,
  comment_abandon: (params: {}) => Promise<CommentAbandonResponse>,
  comment_list: (params: {}) => Promise<any>,
  comment_create: (params: {}) => Promise<any>,

  // Wallet utilities
  wallet_balance: (params: {}) => Promise<BalanceResponse>,
  wallet_decrypt: (prams: {}) => Promise<boolean>,
  wallet_encrypt: (params: {}) => Promise<boolean>,
  wallet_unlock: (params: {}) => Promise<boolean>,
  wallet_list: (params: {}) => Promise<WalletListResponse>,
  wallet_send: (params: {}) => Promise<GenericTxResponse>,
  wallet_status: (params?: {}) => Promise<WalletStatusResponse>,
  address_is_mine: (params: {}) => Promise<boolean>,
  address_unused: (params: {}) => Promise<string>, // New address
  address_list: (params: {}) => Promise<string>,
  transaction_list: (params: {}) => Promise<TxListResponse>,
  txo_list: (params: {}) => Promise<any>,
  account_set: (params: {}) => Promise<any>,
  account_list: (params?: {}) => Promise<any>,

  // Sync
  sync_hash: (params?: {}) => Promise<string>,
  sync_apply: (params: {}) => Promise<SyncApplyResponse>,
  // syncGet

  // The app shouldn't need to do this
  utxo_release: () => Promise<any>,
};
