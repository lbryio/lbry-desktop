type TagState = {
  followedTags: FollowedTags;
  knownTags: KnownTags;
};

type Tag = {
  name: string;
};

type KnownTags = {
  [key: string]: Tag;
};

type FollowedTags = Array<string>;

type TagAction = {
  type: string;
  data: {
    name: string;
  };
};
