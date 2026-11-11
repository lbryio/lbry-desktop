// @ts-ignore: config module might not have type declarations
import { COMMENT_SERVER_API } from "config";

// Type definitions for comment-related API parameters and responses
export interface Comment {
  comment: string;
  comment_id: string;
  claim_id: string;
  timestamp: number;
  is_hidden: boolean;
  channel_id: string;
  channel_name?: string;
  channel_url?: string;
  signature?: string;
  signing_ts?: string;
  is_channel_signature_valid?: boolean;
  parent_id?: number;
  is_pinned: boolean;
  support_amount: number;
  replies: number;
  is_moderator: boolean;
  is_creator: boolean;
  is_global_mod: boolean;
  is_fiat?: boolean;
}

export interface ModerationBlockParams {
  mod_channel_id: string;
  mod_channel_name: string;
  blocked_channel_id: string;
  blocked_channel_name: string;
  creator_channel_id?: string;
  creator_channel_name?: string;
  block_all?: boolean;
  time_out?: number;
  delete_all?: boolean;
  signature: string;
  signing_ts: string;
}

export interface BlockedListArgs {
  mod_channel_id: string;
  mod_channel_name: string;
  creator_channel_id?: string;
  creator_channel_name?: string;
  signature: string;
  signing_ts: string;
}

export interface ModerationAddDelegateParams {
  mod_channel_id: string;
  mod_channel_name: string;
  creator_channel_id: string;
  creator_channel_name: string;
  signature: string;
  signing_ts: string;
}

export interface ModerationRemoveDelegateParams {
  mod_channel_id: string;
  mod_channel_name: string;
  creator_channel_id: string;
  creator_channel_name: string;
  signature: string;
  signing_ts: string;
}

export interface ModerationListDelegatesParams {
  creator_channel_id: string;
  creator_channel_name: string;
  signature: string;
  signing_ts: string;
}

export interface ModerationAmIParams {
  channel_name: string;
  channel_id: string;
  signature: string;
  signing_ts: string;
}

export interface CommentListParams {
  page: number;
  page_size: number;
  claim_id?: string;
  channel_name?: string;
  channel_id?: string;
  author_claim_id?: string;
  parent_id?: string;
  top_level?: boolean;
  hidden?: boolean;
  sort_by?: number;
}

export interface CommentAbandonParams {
  comment_id: string;
  creator_channel_id?: string;
  creator_channel_name?: string;
  channel_id?: string;
  hexdata?: string;
}

export interface CommentCreateParams {
  comment: string;
  claim_id: string;
  parent_id?: string;
  signature: string;
  signing_ts: string;
  support_tx_id?: string;
}

export interface CommentByIdParams {
  comment_id: string;
  with_ancestors: boolean;
}

export interface CommentPinParams {
  comment_id: string;
  channel_id: string;
  channel_name: string;
  remove?: boolean;
  signature: string;
  signing_ts: string;
}

export interface CommentEditParams {
  comment: string;
  comment_id: string;
  signature: string;
  signing_ts: string;
}

export interface ReactionListParams {
  comment_ids: string;
  channel_id?: string;
  channel_name?: string;
  signature?: string;
  signing_ts?: string;
  types?: string;
}

export interface ReactionReactParams {
  comment_ids: string;
  signature?: string;
  signing_ts?: string;
  remove?: boolean;
  clear_types?: string;
  type: string;
  channel_id: string;
  channel_name: string;
}

export interface SettingsParams {
  channel_name?: string;
  channel_id: string;
  signature?: string;
  signing_ts?: string;
}

export interface BlockWordParams {
  channel_name: string;
  channel_id: string;
  signature: string;
  signing_ts: string;
  words: string;
}

export interface UpdateSettingsParams {
  channel_name: string;
  channel_id: string;
  signature: string;
  signing_ts: string;
  comments_enabled?: boolean;
  min_tip_amount_comment?: number;
  min_tip_amount_super_chat?: number;
  slow_mode_min_gap?: number;
}

export interface SuperListParams {}

// API Response interface for JSON-RPC
interface ApiResponse<T> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {
    message: string;
  };
}

const Comments = {
  url: COMMENT_SERVER_API,
  enabled: Boolean(COMMENT_SERVER_API),
  isCustomServer: false,

  setServerUrl: (customUrl?: string): void => {
    Comments.url = customUrl === undefined ? COMMENT_SERVER_API : customUrl;
    Comments.enabled = Boolean(Comments.url);
    Comments.isCustomServer = Comments.url !== COMMENT_SERVER_API;
  },

  moderation_block: (params: ModerationBlockParams): Promise<any> => fetchCommentsApi("moderation.Block", params),

  moderation_unblock: (params: ModerationBlockParams): Promise<any> => fetchCommentsApi("moderation.UnBlock", params),

  moderation_block_list: (params: BlockedListArgs): Promise<any> => fetchCommentsApi("moderation.BlockedList", params),

  moderation_add_delegate: (params: ModerationAddDelegateParams): Promise<any> =>
    fetchCommentsApi("moderation.AddDelegate", params),

  moderation_remove_delegate: (params: ModerationRemoveDelegateParams): Promise<any> =>
    fetchCommentsApi("moderation.RemoveDelegate", params),

  moderation_list_delegates: (params: ModerationListDelegatesParams): Promise<any> =>
    fetchCommentsApi("moderation.ListDelegates", params),

  moderation_am_i: (params: ModerationAmIParams): Promise<any> => fetchCommentsApi("moderation.AmI", params),

  comment_list: (params: CommentListParams): Promise<any> => fetchCommentsApi("comment.List", params),

  comment_abandon: (params: CommentAbandonParams): Promise<any> => fetchCommentsApi("comment.Abandon", params),

  comment_create: (params: CommentCreateParams): Promise<any> => fetchCommentsApi("comment.Create", params),

  comment_by_id: (params: CommentByIdParams): Promise<any> => fetchCommentsApi("comment.ByID", params),

  comment_pin: (params: CommentPinParams): Promise<any> => fetchCommentsApi("comment.Pin", params),

  comment_edit: (params: CommentEditParams): Promise<any> => fetchCommentsApi("comment.Edit", params),

  reaction_list: (params: ReactionListParams): Promise<any> => fetchCommentsApi("reaction.List", params),

  reaction_react: (params: ReactionReactParams): Promise<any> => fetchCommentsApi("reaction.React", params),

  setting_list: (params: SettingsParams): Promise<any> => fetchCommentsApi("setting.List", params),

  setting_block_word: (params: BlockWordParams): Promise<any> => fetchCommentsApi("setting.BlockWord", params),

  setting_unblock_word: (params: BlockWordParams): Promise<any> => fetchCommentsApi("setting.UnBlockWord", params),

  setting_list_blocked_words: (params: SettingsParams): Promise<any> =>
    fetchCommentsApi("setting.ListBlockedWords", params),

  setting_update: (params: UpdateSettingsParams): Promise<any> => fetchCommentsApi("setting.Update", params),

  setting_get: (params: SettingsParams): Promise<any> => fetchCommentsApi("setting.Get", params),

  super_list: (params: SuperListParams): Promise<any> => fetchCommentsApi("comment.SuperChatList", params),
};

function fetchCommentsApi(method: string, params: Record<string, any>): Promise<any> {
  if (!Comments.url) {
    return Promise.reject(new Error("Commenting server is not set."));
  } else if (!Comments.enabled) {
    return Promise.reject(new Error("Comments are not currently enabled."));
  }

  const url = `${Comments.url}?m=${method}`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  };

  return fetch(url, options)
    .then((res: Response) => res.json())
    .then((res: ApiResponse<any>) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res.result;
    });
}

export default Comments;
