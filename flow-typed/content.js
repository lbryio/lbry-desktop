// @flow

declare type ContentState = {
  primaryUri: ?string,
  playingUri: {
    uri?: string,
    collection: PlayingCollection,
  },
  positions: { [string]: { [string]: number } }, // claimId: { outpoint: position }
  history: Array<WatchHistory>,
  recommendationId: { [string]: string }, // claimId: recommendationId
  recommendationParentId: { [string]: string }, // claimId: referrerId
  recommendationUrls: { [string]: Array<string> }, // claimId: [lbryUrls...]
  recommendationClicks: { [string]: Array<number> }, // "claimId": [clicked indices...]
  lastViewedAnnouncement: ?string, // undefined = not seen in wallet.
  recsysEntries: { [ClaimId]: RecsysEntry }, // Persistent shadow copy. The main one resides in RecSys.
};

declare type WatchHistory = {
  uri: string,
  lastViewed: number,
};

declare type PlayingUri = {
  uri?: ?string,
  primaryUri?: string,
  pathname?: string,
  commentId?: string,
  collection: PlayingCollection,
  source?: string,
};

declare type PlayingCollection = {
  collectionId?: ?string,
  loop?: ?boolean,
  shuffle?: ?{ newUrls: Array<string> },
};
