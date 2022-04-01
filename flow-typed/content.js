// @flow

declare type ContentState = {
  primaryUri: ?string,
  playingUri: {}, // Someone please fill in.
  positions: { [string]: { [string]: number } }, // claimId: { outpoint: position }
  history: Array<WatchHistory>,
  recommendationId: { [string]: string }, // claimId: recommendationId
  recommendationParentId: { [string]: string}, // claimId: referrerId
  recommendationUrls: { [string]: Array<string>}, // claimId: [lbryUrls...]
  recommendationClicks: { [string]: Array<number>}, // "claimId": [clicked indices...]
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
  collectionId?: ?string,
  source?: string,
};
