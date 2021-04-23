declare type Comment = {
  comment: string, // comment body
  comment_id: string, // sha256 digest
  claim_id: string, // id linking to the claim this comment
  timestamp: number, // integer representing unix-time
  is_hidden: boolean, // claim owner may enable/disable this
  channel_id: string, // claimId of channel signing this comment
  channel_name?: string, // name of channel claim
  channel_url?: string, // full lbry url to signing channel
  signature?: string, // signature of comment by originating channel
  signing_ts?: string, // timestamp used when signing this comment
  is_channel_signature_valid?: boolean, // whether or not the signature could be validated
  parent_id?: number, // comment_id of comment this is in reply to
  is_pinned: boolean,
  support_amount: number,
};

// todo: relate individual comments to their commentId
declare type CommentsState = {
  commentsByUri: { [string]: string },
  superChatsByUri: { [string]: { totalAmount: number, comments: Array<Comment> } },
  byId: { [string]: Array<string> },
  repliesByParentId: { [string]: Array<string> }, // ParentCommentID -> list of reply comments
  topLevelCommentsById: { [string]: Array<string> }, // ClaimID -> list of top level comments
  commentById: { [string]: Comment },
  isLoading: boolean,
  myComments: ?Set<string>,
  isFetchingReacts: boolean,
  myReactsByCommentId: any,
  othersReactsByCommentId: any,
  pendingCommentReactions: Array<string>,
  moderationBlockList: ?Array<string>,
  fetchingModerationBlockList: boolean,
  blockingByUri: {},
  unBlockingByUri: {},
};

declare type CommentReactParams = {
  comment_ids: string,
  channel_name: string,
  channel_id: string,
  react_type: string,
  clear_types?: string,
  remove?: boolean,
};

// @flow
declare type CommentListParams = {
  page: number,
  page_size: number,
  claim_id: string,
};

declare type CommentListResponse = {
  items: Array<Comment>,
  total_amount: number,
};

declare type CommentAbandonParams = {
  comment_id: string,
  creator_channel_id?: string,
  creator_channel_name?: string,
  channel_id?: string,
  hexdata?: string,
};

declare type CommentCreateParams = {
  comment: string,
  claim_id: string,
  parent_id?: string,
  signature: string,
  signing_ts: number,
  support_tx_id?: string,
};

declare type SuperListParams = {};

declare type ModerationBlockParams = {};
