declare type TagState = {
  followedTags: FollowedTags,
  knownTags: KnownTags,
};

declare type Tag = {
  name: string,
};

declare type KnownTags = {
  [string]: Tag,
};

declare type FollowedTags = Array<string>;

declare type TagAction = {
  type: string,
  data: {
    name: string,
  },
};
