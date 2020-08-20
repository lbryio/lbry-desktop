declare type Comment = {
  comment: string, // comment body
  comment_id: string, // sha256 digest
  claim_id: string, // id linking to the claim this comment
  timestamp: number, // integer representing unix-time
  is_hidden: boolean, // claim owner may enable/disable this
  channel_id?: string,  // claimId of channel signing this comment
  channel_name?: string,  // name of channel claim
  channel_url?: string, // full lbry url to signing channel
  signature?: string, // signature of comment by originating channel
  signing_ts?: string, // timestamp used when signing this comment
  is_channel_signature_valid?: boolean, // whether or not the signature could be validated
  parent_id?: number, // comment_id of comment this is in reply to
};

// todo: relate individual comments to their commentId
declare type CommentsState = {
  commentsByUri: { [string]: string },
  byId: { [string]: Array<string> },
  repliesByParentId: { [string]: Array<string> }, // ParentCommentID -> list of reply comments
  topLevelCommentsById: { [string]: Array<string> }, // ClaimID -> list of top level comments
  commentById: { [string]: Comment },
  isLoading: boolean,
  myComments: ?Set<string>,
};
