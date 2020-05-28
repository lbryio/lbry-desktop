// @flow
declare type Transaction = {
  amount: number,
  claim_id: string,
  claim_name: string,
  fee: number,
  nout: number,
  txid: string,
  type: string,
  date: Date,
};

declare type Support = {
  address: string,
  amount: string,
  claim_id: string,
  confirmations: number,
  height: string,
  is_change: string,
  is_mine: string,
  name: string,
  normalized_name: string,
  nout: string,
  permanent_url: string,
  timestamp: number,
  txid: string,
  type: string,
};
