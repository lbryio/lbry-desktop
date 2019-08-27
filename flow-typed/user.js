// @flow

// Move this to lbryinc
declare type User = {
  created_at: string,
  family_name: ?string,
  given_name: ?string,
  groups: Array<string>,
  has_verified_email: boolean,
  id: number,
  invite_reward_claimed: boolean,
  invited_at: ?number,
  invited_by_id: number,
  invites_remaining: number,
  is_email_enabled: boolean,
  is_identity_verified: boolean,
  is_reward_approved: boolean,
  language: string,
  manual_approval_user_id: ?number,
  primary_email: string,
  reward_status_change_trigger: string,
  updated_at: string,
  youtube_channels: ?Array<string>,
};
