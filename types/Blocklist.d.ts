type BlocklistState = {
  blockedChannels: Array<string>;
};

type BlocklistAction = {
  type: string;
  data: {
    uri: string;
  };
};
