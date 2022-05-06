// @flow
declare type StatusResponse = {
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
  wallet: ?{
    connected: string,
    best_blockhash: string,
    blocks: number,
    blocks_behind: number,
    is_encrypted: boolean,
    is_locked: boolean,
    headers_synchronization_progress: number,
    available_servers: number,
  },
};

declare type VersionResponse = {
  build: string,
  lbrynet_version: string,
  os_release: string,
  os_system: string,
  platform: string,
  processor: string,
  python_version: string,
};

declare type BalanceResponse = {
  available: string,
  reserved: string,
  reserved_subtotals: ?{
    claims: string,
    supports: string,
    tips: string,
  },
  total: string,
};

declare type ResolveResponse = {
  // Keys are the url(s) passed to resolve
  [string]: { error?: {}, stream?: StreamClaim, channel?: ChannelClaim, collection?: CollectionClaim, claimsInChannel?: number },
};

declare type GetResponse = FileListItem & { error?: string };

declare type GenericTxResponse = {
  height: number,
  hex: string,
  inputs: Array<{}>,
  outputs: Array<{}>,
  total_fee: string,
  total_input: string,
  total_output: string,
  txid: string,
};

declare type PublishResponse = GenericTxResponse & {
  // Only first value in outputs is a claim
  // That's the only value we care about
  outputs: Array<Claim>,
};

declare type ClaimSearchResponse = {
  items: Array<Claim>,
  page: number,
  page_size: number,
  total_items?: number,
  total_pages?: number,
};

declare type ClaimListResponse = {
  items: Array<ChannelClaim | Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type ChannelCreateResponse = GenericTxResponse & {
  outputs: Array<ChannelClaim>,
};

declare type ChannelUpdateResponse = GenericTxResponse & {
  outputs: Array<ChannelClaim>,
};

declare type CommentCreateResponse = Comment;
declare type CommentUpdateResponse = Comment;

declare type MyReactions = {
  // Keys are the commentId
  [string]: Array<string>,
};

declare type OthersReactions = {
  // Keys are the commentId
  [string]: {
    // Keys are the reaction_type, e.g. 'like'
    [string]: number,
  },
};

declare type CommentReactListResponse = {
  my_reactions: Array<MyReactions>,
  others_reactions: Array<OthersReactions>,
};

declare type CommentHideResponse = {
  // keyed by the CommentIds entered
  [string]: { hidden: boolean },
};

declare type CommentPinResponse = {
  // keyed by the CommentIds entered
  items: Comment,
};

declare type CommentAbandonResponse = {
  // keyed by the CommentId given
  abandoned: boolean,
  claim_id: string,
};

declare type ChannelListResponse = {
  items: Array<ChannelClaim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type ChannelSignResponse = {
  signature: string,
  signing_ts: string,
};

declare type CollectionCreateResponse = {
  outputs: Array<Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
}

declare type CollectionListResponse = {
  items: Array<Claim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type CollectionResolveResponse = {
  items: Array<Claim>,
  total_items: number,
};

declare type CollectionResolveOptions = {
  claim_id: string,
};

declare type CollectionListOptions = {
  page: number,
  page_size: number,
  resolve?: boolean,
};

declare type FileListResponse = {
  items: Array<FileListItem>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type TxListResponse = {
  items: Array<Transaction>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type SupportListResponse = {
  items: Array<Support>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type BlobListResponse = { items: Array<string> };

declare type WalletListResponse = Array<{
  id: string,
  name: string,
}>;

declare type WalletStatusResponse = {
  is_encrypted: boolean,
  is_locked: boolean,
  is_syncing: boolean,
};

declare type SyncApplyResponse = {
  hash: string,
  data: string,
};

declare type SupportAbandonResponse = GenericTxResponse;

declare type StreamListResponse = {
  items: Array<StreamClaim>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type StreamRepostOptions = {
  name: string,
  bid: string,
  claim_id: string,
  channel_id?: string,
};

declare type StreamRepostResponse = GenericTxResponse;

declare type PurchaseListResponse = {
  items: Array<PurchaseReceipt & { claim: StreamClaim }>,
  page: number,
  page_size: number,
  total_items: number,
  total_pages: number,
};

declare type PurchaseListOptions = {
  page: number,
  page_size: number,
  resolve: boolean,
  claim_id?: string,
  channel_id?: string,
};

//
// Types used in the generic Lbry object that is exported
//
declare type LbryTypes = {
  isConnected: boolean,
  connectPromise: any, // null |
  connect: () => any, // void | Promise<any> ?
  daemonConnectionString: string,
  alternateConnectionString: string,
  methodsUsingAlternateConnectionString: Array<string>,
  apiRequestHeaders: { [key: string]: string },
  setDaemonConnectionString: string => void,
  setApiHeader: (string, string) => void,
  unsetApiHeader: string => void,
  overrides: { [string]: ?Function },
  setOverride: (string, Function) => void,
  // getMediaType: (?string, ?string) => string,

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
