// @flow
declare type CommentListParams = {
  page: number,
  page_size: number,
  claim_id: string,
};

declare type CommentAbandonParams = {
  comment_id: string,
  creator_channel_id?: string,
  creator_channel_name?: string,
  channel_id?: string,
  hexdata?: string,
};

declare type ModerationBlockParams = {};
