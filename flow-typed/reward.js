// @flow

declare type Reward = {
  created_at: string,
  id: number,
  reward_amount: number,
  reward_range?: string,
  reward_description: string,
  reward_notification: string,
  reward_title: string,
  reward_type: string,
  reward_version: ?string,
  transaction_id: ?string,
  updated_at: ?string,
  claim_code: string,
};
