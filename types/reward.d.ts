type Reward = {
  created_at: string;
  id: number;
  reward_amount: number;
  reward_range?: string;
  reward_description: string;
  reward_notification: string;
  reward_title: string;
  reward_type: string;
  reward_version: string | null | undefined;
  transaction_id: string | null | undefined;
  updated_at: string | null | undefined;
  claim_code: string;
};
