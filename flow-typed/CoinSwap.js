declare type CoinSwapInfo = {
  coin: string,
  sendAddress: string,
  sendAmount: number,
  lbcAmount: number,
}

declare type CoinSwapState = {
  coinSwaps: Array<CoinSwapInfo>
};

declare type CoinSwapAction = {
  type: string,
  data: {
    coin: string,
    sendAddress: string,
    sendAmount: number,
    lbcAmount: number,
  },
};

declare type CoinSwapRemoveAction = {
  type: string,
  data: {
    sendAddress: string,
  },
};
