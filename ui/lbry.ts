import "proxy-polyfill";

const CHECK_DAEMON_STARTED_TRY_NUMBER = 200;

// Type definitions and interfaces
export type MediaType =
  "video" | "audio" | "image" | "script" | "document" | "e-book" | "3D-file" | "comic-book" | "application" | "unknown";

export interface ApiRequestHeaders {
  "Content-Type": string;
  [key: string]: string;
}

export interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params?: Record<string, any>;
  id: number;
}

export interface JsonRpcResponse {
  jsonrpc: string;
  result?: any;
  error?: any;
  id: number;
}

export interface LbryOverrides {
  [methodName: string]: (params: Record<string, any>) => Promise<any>;
}

export interface LbryConfig {
  isConnected: boolean;
  connectPromise: Promise<any> | null;
  daemonConnectionString: string;
  alternateConnectionString: string;
  methodsUsingAlternateConnectionString: string[];
  apiRequestHeaders: ApiRequestHeaders;
  overrides: LbryOverrides;
}

// Base interface for API method parameters
export interface BaseParams {
  [key: string]: any;
}

// Specific parameter interfaces for common methods
export interface ClaimSearchParams extends BaseParams {
  name?: string;
  claim_id?: string;
  channel?: string;
  channel_ids?: string[];
  not_channel_ids?: string[];
  has_channel_signature?: boolean;
  valid_channel_signature?: boolean;
  invalid_channel_signature?: boolean;
  limit?: number;
  page?: number;
  page_size?: number;
  order_by?: string[];
  release_time?: string;
  claim_type?: string[];
  stream_types?: string[];
  media_types?: string[];
  fee_currency?: string;
  fee_amount?: string;
  duration?: string;
  any_tags?: string[];
  all_tags?: string[];
  not_tags?: string[];
  any_languages?: string[];
  all_languages?: string[];
  not_languages?: string[];
  any_locations?: string[];
  all_locations?: string[];
  not_locations?: string[];
}

export interface WalletBalanceParams extends BaseParams {
  wallet_id?: string;
  confirmations?: number;
}

export interface FileListParams extends BaseParams {
  sd_hash?: string;
  file_name?: string;
  stream_hash?: string;
  rowid?: number;
  added_on?: string;
  claim_id?: string;
  outpoint?: string;
  txid?: string;
  nout?: number;
  channel_claim_id?: string;
  channel_name?: string;
  claim_name?: string;
  blobs_completed?: number;
  blobs_in_stream?: number;
}

// Main LBRY interface
export interface ILbry extends LbryConfig {
  // Configuration methods
  setDaemonConnectionString: (value: string) => void;
  setApiHeader: (key: string, value: string) => void;
  unsetApiHeader: (key: string) => void;
  setOverride: (methodName: string, newMethod: (params: BaseParams) => Promise<any>) => void;
  getApiRequestHeaders: () => ApiRequestHeaders;
  getMediaType: (contentType?: string | null, fileName?: string | null) => MediaType;

  // Connection methods
  connect: () => Promise<any>;

  // System methods
  status: (params?: BaseParams) => Promise<any>;
  stop: () => Promise<any>;
  version: () => Promise<any>;

  // Claim methods
  resolve: (params: BaseParams) => Promise<any>;
  get: (params: BaseParams) => Promise<any>;
  claim_search: (params?: ClaimSearchParams) => Promise<any>;
  claim_list: (params?: BaseParams) => Promise<any>;
  channel_create: (params: BaseParams) => Promise<any>;
  channel_update: (params: BaseParams) => Promise<any>;
  channel_import: (params: BaseParams) => Promise<any>;
  channel_list: (params?: BaseParams) => Promise<any>;
  stream_abandon: (params: BaseParams) => Promise<any>;
  stream_list: (params?: BaseParams) => Promise<any>;
  channel_abandon: (params: BaseParams) => Promise<any>;
  channel_sign: (params: BaseParams) => Promise<any>;
  support_create: (params: BaseParams) => Promise<any>;
  support_list: (params?: BaseParams) => Promise<any>;
  stream_repost: (params: BaseParams) => Promise<any>;
  collection_resolve: (params: BaseParams) => Promise<any>;
  collection_list: (params?: BaseParams) => Promise<any>;
  collection_create: (params: BaseParams) => Promise<any>;
  collection_update: (params: BaseParams) => Promise<any>;

  // File methods
  file_list: (params?: FileListParams) => Promise<any>;
  file_delete: (params?: BaseParams) => Promise<any>;
  file_set_status: (params?: BaseParams) => Promise<any>;
  blob_delete: (params?: BaseParams) => Promise<any>;
  blob_list: (params?: BaseParams) => Promise<any>;
  file_reflect: (params?: BaseParams) => Promise<any>;

  // Wallet methods
  wallet_balance: (params?: WalletBalanceParams) => Promise<any>;
  wallet_decrypt: () => Promise<any>;
  wallet_encrypt: (params?: BaseParams) => Promise<any>;
  wallet_unlock: (params?: BaseParams) => Promise<any>;
  wallet_list: (params?: BaseParams) => Promise<any>;
  wallet_send: (params?: BaseParams) => Promise<any>;
  wallet_status: (params?: BaseParams) => Promise<any>;
  address_is_mine: (params?: BaseParams) => Promise<any>;
  address_unused: (params?: BaseParams) => Promise<any>;
  address_list: (params?: BaseParams) => Promise<any>;
  transaction_list: (params?: BaseParams) => Promise<any>;
  utxo_release: (params?: BaseParams) => Promise<any>;
  support_abandon: (params?: BaseParams) => Promise<any>;
  purchase_list: (params?: BaseParams) => Promise<any>;
  txo_list: (params?: BaseParams) => Promise<any>;
  account_list: (params?: BaseParams) => Promise<any>;
  account_set: (params?: BaseParams) => Promise<any>;

  // Sync methods
  sync_hash: (params?: BaseParams) => Promise<any>;
  sync_apply: (params?: BaseParams) => Promise<any>;

  // Preference methods
  preference_get: (params?: BaseParams) => Promise<any>;
  preference_set: (params?: BaseParams) => Promise<any>;

  // Comment methods
  comment_list: (params?: BaseParams) => Promise<any>;
  comment_create: (params?: BaseParams) => Promise<any>;
  comment_hide: (params?: BaseParams) => Promise<any>;
  comment_abandon: (params?: BaseParams) => Promise<any>;
  comment_update: (params?: BaseParams) => Promise<any>;

  // Publishing
  publish: (params?: BaseParams) => Promise<any>;

  // Dynamic method access
  [key: string]: any;
}

//
// Basic LBRY sdk connection config
// Offers a proxy to call LBRY sdk methods
//
const Lbry: ILbry = {
  isConnected: false,
  connectPromise: null,
  daemonConnectionString: "http://localhost:5279",
  alternateConnectionString: "",
  methodsUsingAlternateConnectionString: [],
  apiRequestHeaders: { "Content-Type": "application/json-rpc" },
  overrides: {},

  // Allow overriding daemon connection string (e.g. to `/api/proxy` for lbryweb)
  setDaemonConnectionString: (value: string): void => {
    Lbry.daemonConnectionString = value;
  },

  setApiHeader: (key: string, value: string): void => {
    Lbry.apiRequestHeaders = Object.assign(Lbry.apiRequestHeaders, { [key]: value });
  },

  unsetApiHeader: (key: string): void => {
    if (Object.keys(Lbry.apiRequestHeaders).includes(key)) {
      delete Lbry.apiRequestHeaders[key];
    }
  },

  setOverride: (methodName: string, newMethod: (params: BaseParams) => Promise<any>): void => {
    Lbry.overrides[methodName] = newMethod;
  },

  getApiRequestHeaders: (): ApiRequestHeaders => Lbry.apiRequestHeaders,

  // Returns a human readable media type based on the content type or extension of a file that is returned by the sdk
  getMediaType: (contentType?: string | null, fileName?: string | null): MediaType => {
    if (fileName && fileName.split(".").length > 1) {
      const formats: [RegExp, MediaType][] = [
        [/\.(mp4|m4v|webm|flv|f4v|ogv)$/i, "video"],
        [/\.(mp3|m4a|aac|wav|flac|ogg|opus)$/i, "audio"],
        [/\.(jpeg|jpg|png|gif|svg|webp)$/i, "image"],
        [/\.(h|go|ja|java|js|jsx|c|cpp|cs|css|rb|scss|sh|php|py)$/i, "script"],
        [/\.(html|json|csv|txt|log|md|markdown|docx|pdf|xml|yml|yaml)$/i, "document"],
        [/\.(pdf|odf|doc|docx|epub|org|rtf)$/i, "e-book"],
        [/\.(stl|obj|fbx|gcode)$/i, "3D-file"],
        [/\.(cbr|cbt|cbz)$/i, "comic-book"],
        [/\.(lbry)$/i, "application"],
      ];

      const result = formats.reduce<string | MediaType>((ret, [regex, mediaType]) => {
        if (typeof ret === "string" && regex.test(ret)) {
          return mediaType;
        }
        return ret;
      }, fileName);

      return result === fileName ? "unknown" : (result as MediaType);
    } else if (contentType) {
      const match = /^[^/]+/.exec(contentType);
      return match ? (match[0] as MediaType) : "unknown";
    }

    return "unknown";
  },

  //
  // Lbry SDK Methods
  // https://lbry.tech/api/sdk
  //
  status: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("status", params),
  stop: (): Promise<any> => daemonCallWithResult("stop", {}),
  version: (): Promise<any> => daemonCallWithResult("version", {}),

  // Claim fetching and manipulation
  resolve: (params: BaseParams): Promise<any> => daemonCallWithResult("resolve", params),
  get: (params: BaseParams): Promise<any> => daemonCallWithResult("get", params),
  claim_search: (params: ClaimSearchParams = {}): Promise<any> => daemonCallWithResult("claim_search", params),
  claim_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("claim_list", params),
  channel_create: (params: BaseParams): Promise<any> => daemonCallWithResult("channel_create", params),
  channel_update: (params: BaseParams): Promise<any> => daemonCallWithResult("channel_update", params),
  channel_import: (params: BaseParams): Promise<any> => daemonCallWithResult("channel_import", params),
  channel_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("channel_list", params),
  stream_abandon: (params: BaseParams): Promise<any> => daemonCallWithResult("stream_abandon", params),
  stream_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("stream_list", params),
  channel_abandon: (params: BaseParams): Promise<any> => daemonCallWithResult("channel_abandon", params),
  channel_sign: (params: BaseParams): Promise<any> => daemonCallWithResult("channel_sign", params),
  support_create: (params: BaseParams): Promise<any> => daemonCallWithResult("support_create", params),
  support_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("support_list", params),
  stream_repost: (params: BaseParams): Promise<any> => daemonCallWithResult("stream_repost", params),
  collection_resolve: (params: BaseParams): Promise<any> => daemonCallWithResult("collection_resolve", params),
  collection_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("collection_list", params),
  collection_create: (params: BaseParams): Promise<any> => daemonCallWithResult("collection_create", params),
  collection_update: (params: BaseParams): Promise<any> => daemonCallWithResult("collection_update", params),

  // File fetching and manipulation
  file_list: (params: FileListParams = {}): Promise<any> => daemonCallWithResult("file_list", params),
  file_delete: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("file_delete", params),
  file_set_status: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("file_set_status", params),
  blob_delete: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("blob_delete", params),
  blob_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("blob_list", params),
  file_reflect: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("file_reflect", params),

  // Wallet utilities
  wallet_balance: (params: WalletBalanceParams = {}): Promise<any> => daemonCallWithResult("wallet_balance", params),
  wallet_decrypt: (): Promise<any> => daemonCallWithResult("wallet_decrypt", {}),
  wallet_encrypt: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("wallet_encrypt", params),
  wallet_unlock: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("wallet_unlock", params),
  wallet_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("wallet_list", params),
  wallet_send: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("wallet_send", params),
  wallet_status: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("wallet_status", params),
  address_is_mine: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("address_is_mine", params),
  address_unused: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("address_unused", params),
  address_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("address_list", params),
  transaction_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("transaction_list", params),
  utxo_release: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("utxo_release", params),
  support_abandon: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("support_abandon", params),
  purchase_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("purchase_list", params),
  txo_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("txo_list", params),
  account_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("account_list", params),
  account_set: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("account_set", params),

  sync_hash: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("sync_hash", params),
  sync_apply: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("sync_apply", params),

  // Preferences
  preference_get: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("preference_get", params),
  preference_set: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("preference_set", params),

  // Comments
  comment_list: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("comment_list", params),
  comment_create: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("comment_create", params),
  comment_hide: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("comment_hide", params),
  comment_abandon: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("comment_abandon", params),
  comment_update: (params: BaseParams = {}): Promise<any> => daemonCallWithResult("comment_update", params),

  // Connect to the sdk
  connect: (): Promise<any> => {
    if (Lbry.connectPromise === null) {
      Lbry.connectPromise = new Promise((resolve, reject) => {
        let tryNum = 0;
        // Check every half second to see if the daemon is accepting connections
        function checkDaemonStarted(): void {
          tryNum += 1;
          Lbry.status()
            .then(resolve)
            .catch(() => {
              if (tryNum <= CHECK_DAEMON_STARTED_TRY_NUMBER) {
                setTimeout(checkDaemonStarted, tryNum < 50 ? 400 : 1000);
              } else {
                reject(new Error("Unable to connect to LBRY"));
              }
            });
        }

        checkDaemonStarted();
      });
    }

    return Lbry.connectPromise;
  },

  publish: (params: BaseParams = {}): Promise<any> =>
    new Promise((resolve, reject) => {
      if (Lbry.overrides.publish) {
        Lbry.overrides.publish(params).then(resolve, reject);
      } else {
        apiCall("publish", params, resolve, reject);
      }
    }),
};

function checkAndParse(response: Response): Promise<JsonRpcResponse> {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  return response.json().then((json: JsonRpcResponse) => {
    let error: Error;
    if (json.error) {
      const errorMessage = typeof json.error === "object" ? json.error.message : json.error;
      error = new Error(errorMessage);
    } else {
      error = new Error("Protocol error with unknown response signature");
    }
    return Promise.reject(error);
  });
}

export function apiCall(
  method: string,
  params: BaseParams | null | undefined,
  resolve: (result: any) => void,
  reject: (error: any) => void
): Promise<void> {
  const counter = new Date().getTime();
  const options: RequestInit = {
    method: "POST",
    headers: Lbry.apiRequestHeaders,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: counter,
    } as JsonRpcRequest),
  };

  const connectionString = Lbry.methodsUsingAlternateConnectionString.includes(method)
    ? Lbry.alternateConnectionString
    : Lbry.daemonConnectionString;

  return fetch(connectionString + "?m=" + method, options)
    .then(checkAndParse)
    .then((response: JsonRpcResponse) => {
      const error = response.error || (response.result && response.result.error);

      if (error) {
        return reject(error);
      }
      return resolve(response.result);
    })
    .catch(reject);
}

function daemonCallWithResult(name: string, params: BaseParams = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    apiCall(
      name,
      params,
      (result: any) => {
        resolve(result);
      },
      reject
    );
  });
}

// This is only for a fallback
// If there is a Lbry method that is being called by an app, it should be added to the interface
const lbryProxy = new Proxy(Lbry, {
  get(target: ILbry, name: string): any {
    if (name in target) {
      return target[name as keyof ILbry];
    }

    return (params: BaseParams = {}): Promise<any> =>
      new Promise((resolve, reject) => {
        apiCall(name, params, resolve, reject);
      });
  },
});

export default lbryProxy;
