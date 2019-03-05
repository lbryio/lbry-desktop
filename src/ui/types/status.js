// @flow

export type Status = {
  error?: {},
  is_running: boolean,
  is_first_run: boolean,
  installation_id: string,
  skipped_components: Array<string>,
  startup_status: {
    blob_manager: boolean,
    blockchain_headers: boolean,
    database: boolean,
    dht: boolean,
    exchange_rate_manager: boolean,
    file_manager: boolean,
    hash_announcer: boolean,
    payment_rate_manager: boolean,
    peer_protocol_server: boolean,
    rate_limiter: boolean,
    stream_identifier: boolean,
    upnp: boolean,
    wallet: boolean,
  },
  blob_manager: {
    finished_blobs: number,
  },
  connection_status: {
    code: string,
    message: string,
  },
  dht: {
    node_id: string,
    peers_in_routing_table: number,
  },
  hash_announcer: {
    announce_queue_size: number,
  },
  wallet?: {
    best_blockhash: string,
    blocks: number,
    blocks_behind: number,
    is_encrypted: boolean,
    is_locked: boolean,
  },
  blockchain_headers?: {
    download_progress: number,
  },
};
