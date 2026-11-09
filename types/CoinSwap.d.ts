type CoinSwapInfo = {
  chargeCode: string;
  coins: Array<string>;
  sendAddresses: { [key: string]: string };
  sendAmounts: { [key: string]: any };
  lbcAmount: number;
  status?: {
    status: string;
    receiptCurrency: string;
    receiptTxid: string;
    lbcTxid: string;
  };
};

type CoinSwapState = {
  coinSwaps: Array<CoinSwapInfo>;
};

type CoinSwapAddAction = {
  type: string;
  data: CoinSwapInfo;
};

type CoinSwapRemoveAction = {
  type: string;
  data: {
    chargeCode: string;
  };
};
