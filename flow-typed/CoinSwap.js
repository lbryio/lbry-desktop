declare type CoinSwapState = {
  btcAddresses: Array<string>
};

declare type CoinSwapAction = {
  type: string,
  data: {
    btcAddress: string,
  },
};
