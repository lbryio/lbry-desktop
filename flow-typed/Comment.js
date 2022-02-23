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
  replies: number, // number of direct replies (i.e. excluding nested replies).
  is_moderator: boolean,
  is_creator: boolean,
  is_global_mod: boolean,
  is_fiat?: boolean,
  removed?: boolean,
};

declare type CommentSubmitParams = {
  comment: string,
  claim_id: string,
  parent_id?: string,
  txid?: ?string,
  payment_intent_id?: ?string,
  environment?: ?string,
  sticker: boolean,
};

declare type PerChannelSettings = {
  words?: Array<string>,
  comments_enabled?: boolean,
  min_tip_amount_comment?: number,
  min_tip_amount_super_chat?: number,
  slow_mode_min_gap?: number,
  time_since_first_comment?: number,
};

// todo: relate individual comments to their commentId
declare type CommentsState = {
  commentsByUri: { [string]: string },
  superChatsByUri: { [string]: { totalAmount: number, comments: Array<Comment> } },
  byId: { [string]: Array<string> }, // ClaimID -> list of fetched comment IDs.
  totalCommentsById: {}, // ClaimId -> ultimate total (including replies) in commentron.
  repliesByParentId: { [string]: Array<string> }, // ParentCommentID -> list of fetched replies.
  repliesTotalPagesByParentId: {}, // ParentCommentID -> total number of reply pages for a parentId in commentron.
  topLevelCommentsById: { [string]: Array<string> }, // ClaimID -> list of fetched top level comments.
  topLevelTotalPagesById: { [string]: number }, // ClaimID -> total number of top-level pages in commentron. Based on COMMENT_PAGE_SIZE_TOP_LEVEL.
  topLevelTotalCommentsById: { [string]: number }, // ClaimID -> total top level comments in commentron.
  commentById: { [string]: Comment },
  linkedCommentAncestors: { [string]: Array<string> }, // {"linkedCommentId": ["parentId", "grandParentId", ...]}
  pinnedCommentsById: {}, // ClaimId -> array of pinned comment IDs
  isLoading: boolean,
  isLoadingById: boolean,
  isLoadingByParentId: { [string]: boolean },
  isCommenting: boolean,
  myComments: ?Set<string>,
  isFetchingReacts: boolean,
  myReactsByCommentId: ?{ [string]: Array<string> }, // {"CommentId:MyChannelId": ["like", "dislike", ...]}
  othersReactsByCommentId: ?{ [string]: { [string]: number } }, // {"CommentId:MyChannelId": {"like": 2, "dislike": 2, ...}}
  pendingCommentReactions: Array<string>,
  moderationBlockList: ?Array<string>, // @KP rename to "personalBlockList"?
  adminBlockList: ?Array<string>,
  moderatorBlockList: ?Array<string>,
  moderatorBlockListDelegatorsMap: { [string]: Array<string> }, // {"blockedUri": ["delegatorUri1", ""delegatorUri2", ...]}
  fetchingModerationBlockList: boolean,
  moderationDelegatesById: { [string]: Array<{ channelId: string, channelName: string }> },
  fetchingModerationDelegates: boolean,
  moderationDelegatorsById: { [string]: { global: boolean, delegators: { name: string, claimId: string } } },
  fetchingModerationDelegators: boolean,
  blockingByUri: {},
  unBlockingByUri: {},
  personalTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  adminTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  moderatorTimeoutMap: { [uri: string]: { blockedAt: string, bannedFor: number, banRemaining: number } },
  togglingForDelegatorMap: { [string]: Array<string> }, // {"blockedUri": ["delegatorUri1", ""delegatorUri2", ...]}
  settingsByChannelId: { [string]: PerChannelSettings }, // ChannelID -> settings
  fetchingSettings: boolean,
  fetchingBlockedWords: boolean,
};

// Authorization parameters for calls requiring user authentication
declare type Authorization = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
};

// ModAuthorization parameters for calls requiring creator/moderator authentication
declare type ModAuthorization = {
  // Publisher, Moderator or Commentron Admin
  mod_channel_id: string,
  mod_channel_name: string,
  // Creator that Moderator is delegated from. Used for delegated moderation
  creator_channel_id: string,
  creator_channel_name: string,
  signature: string,
  signing_ts: string,
};

declare type CommentReactParams = {
  comment_ids: string,
  channel_name: string,
  channel_id: string,
  react_type: string,
  clear_types?: string,
  remove?: boolean,
};

declare type ReactionReactParams = {
  comment_ids: string,
  signature?: string,
  signing_ts?: string,
  remove?: boolean,
  clear_types?: string,
  type: string,
  channel_id: string,
  channel_name: string,
};

declare type ReactionReactResponse = {
  Reactions: { [string]: { [string]: number } },
};

declare type ReactionListParams = {
  comment_ids: string, // CSV of IDs
  channel_id?: string,
  channel_name?: string,
  signature?: string,
  signing_ts?: string,
  types?: string,
};

declare type ReactionListResponse = {
  my_reactions: Array<MyReactions>,
  others_reactions: Array<OthersReactions>,
};

declare type CommentListParams = {
  page: number, // pagination: which page of results
  page_size: number, // pagination: nr of comments to show in a page (max 200)
  claim_id?: string, // claim id of claim being commented on
  channel_name?: string, // signing channel name of claim (enables 'commentsEnabled' check)
  channel_id?: string, // signing channel claim id of claim (enables 'commentsEnabled' check)
  author_claim_id?: string, // filters comments to just this author
  parent_id?: string, // filters comments to those under this thread
  top_level?: boolean, // filters to only top level comments
  hidden?: boolean, // if true, will show hidden comments as well
  sort_by?: number, // @see: ui/constants/comments.js::SORT_BY
};

declare type CommentListResponse = {
  items: Array<Comment>,
  page: number,
  page_size: number,
  total_items: number, // Grand total for the claim being commented on.
  total_filtered_items: number, // Total for filtered queries (e.g. top_level=true, parent_id=xxx, etc.).
  total_pages: number,
  has_hidden_comments: boolean,
};

declare type CommentByIdParams = {
  comment_id: string,
  with_ancestors: boolean,
};

declare type CommentByIdResponse = {
  item: Comment,
  items: Comment,
  ancestors: Array<Comment>,
};

declare type CommentPinParams = {
  comment_id: string,
  channel_id: string,
  channel_name: string,
  remove?: boolean,
  signature: string,
  signing_ts: string,
};

declare type CommentPinResponse = {
  items: Comment, // "items" is an inherited typo to match SDK. Will be "item" in a new version.
};

declare type CommentEditParams = {
  comment: string,
  comment_id: string,
  signature: string,
  signing_ts: string,
};

declare type CommentEditResponse = Comment;

declare type CommentAbandonParams = {
  comment_id: string,
  creator_channel_id?: string,
  creator_channel_name?: string,
  signature?: string,
  signing_ts?: string,
  mod_channel_id?: string,
  mod_channel_name?: string,
};

declare type MentionedChannel = {
  channel_name: string,
  channel_id: string,
};

declare type CommentCreateParams = {
  comment: string,
  claim_id: string,
  parent_id?: string,
  signature: string,
  signing_ts: string,
  support_tx_id?: string,
  mentioned_channels?: Array<MentionedChannel>,
};

declare type SuperListParams = {};

declare type SuperListResponse = {
  page: number,
  page_size: number,
  total_pages: number,
  total_items: number,
  total_amount: number,
  items: Array<Comment>,
  has_hidden_comments: boolean,
};

declare type ModerationBlockParams = {
  // Publisher, Moderator, or Commentron Admin
  mod_channel_id: string,
  mod_channel_name: string,
  // Offender being blocked
  blocked_channel_id: string,
  blocked_channel_name: string,
  // Creator that Moderator is delegated from. Used for delegated moderation
  creator_channel_id?: string,
  creator_channel_name?: string,
  // ID of comment to remove as part of this block
  offending_comment_id?: string,
  // Blocks identity from comment universally, requires Admin rights on commentron instance
  block_all?: boolean,
  time_out?: ?number,
  // If true will delete all comments of the offender, requires Admin rights on commentron for universal delete
  delete_all?: boolean,
  // The usual signature stuff
  signature: string,
  signing_ts: string,
};

declare type ModerationBlockResponse = {
  deleted_comment_ids: Array<string>,
  banned_channel_id: string,
  all_blocked: boolean,
  banned_from: string,
};

declare type BlockedListArgs = {
  // Publisher, Moderator or Commentron Admin
  mod_channel_id: string,
  mod_channel_name: string,
  // Creator that Moderator is delegated from. Used for delegated moderation
  creator_channel_id?: string,
  creator_channel_name?: string,
  signature: string,
  signing_ts: string,
};

declare type ModerationAddDelegateParams = Authorization & {
  mod_channel_id: string,
  mod_channel_name: string,
};

declare type ModerationRemoveDelegateParams = Authorization & {
  mod_channel_id: string,
  mod_channel_name: string,
};

declare type ModerationListDelegatesParams = Authorization;

declare type ModerationAmIParams = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
};

declare type SettingsParams = {
  channel_name?: string,
  channel_id: string,
  signature?: string,
  signing_ts?: string,
};

declare type SettingsResponse = {
  words?: string,
  comments_enabled: boolean,
  min_tip_amount_comment: number,
  min_tip_amount_super_chat: number,
  slow_mode_min_gap: number,
  curse_jar_amount: number,
  filters_enabled?: boolean,
};

declare type UpdateSettingsParams = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
  comments_enabled?: boolean,
  min_tip_amount_comment?: number,
  min_tip_amount_super_chat?: number,
  slow_mode_min_gap?: number,
  time_since_first_comment?: number,
};

declare type BlockWordParams = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
  words: string, // CSV list of containing words to block comment on content
};
