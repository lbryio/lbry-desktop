declare type BlocklistState = {
  blockedChannels: Array<string>
};

declare type BlocklistAction = {
  type: string,
  data: {
    uri: string,
  },
};
