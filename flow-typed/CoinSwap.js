declare type CoinSwapInfo = {
  chargeCode: string,
  coins: Array<string>,
  sendAddresses: { [string]: string},
  sendAmounts: { [string]: any },
  lbcAmount: number,
  status?: {
    status: string,
    receiptCurrency: string,
    receiptTxid: string,
    lbcTxid: string,
  },
}

declare type CoinSwapState = {
  coinSwaps: Array<CoinSwapInfo>,
};

declare type CoinSwapAddAction = {
  type: string,
  data: CoinSwapInfo,
};

declare type CoinSwapRemoveAction = {
  type: string,
  data: {
    chargeCode: string,
  },
};
