declare type Txo = {
  amount: number,
  claim_id: string,
  normalized_name: string,
  nout: number,
  txid: string,
  type: string,
  value_type: string,
  timestamp: number,
  is_my_output: boolean,
  is_my_input: boolean,
  is_spent: boolean,
  signing_channel?: {
    channel_id: string,
  },
};

declare type TxoListParams = {
  page: number,
  page_size: number,
  type: string,
  is_my_input?: boolean,
  is_my_output?: boolean,
  is_not_my_input?: boolean,
  is_not_my_output?: boolean,
  is_spent?: boolean,
};
