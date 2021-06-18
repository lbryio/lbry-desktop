// @flow

type DeviceType = 'mobile' | 'web' | 'desktop';

declare type User = {
  country: ?string,
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
  password_set: boolean,
  language: string,
  manual_approval_user_id: ?number,
  primary_email: ?string,
  latest_claimed_email: ?string,
  reward_status_change_trigger: string,
  updated_at: string,
  youtube_channels: ?Array<string>,
  device_types: Array<DeviceType>,
  lbry_first_approved: boolean,
  experimental_ui: boolean,
  odysee_live_enabled: boolean,
  odysee_live_disabled: boolean,
  global_mod: boolean,
};
