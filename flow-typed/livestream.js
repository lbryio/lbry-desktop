// @flow

declare type LivestreamReplayItem = {
  data: {
    claimId: string,
    deleted: boolean,
    deletedAt: ?string,
    ffprobe: any,
    fileDuration: number, // decimal? float? string?
    fileType: string,
    fileLocation: string,
    fileSize: number,
    key: string,
    published: boolean,
    publishedAt: ?string,
    service: string,
    thumbnails: Array<string>,
    uploadedAt: string, // Date?
  },
  id: string,
}
declare type LivestreamReplayData = Array<LivestreamReplayItem>;

declare type LivestreamState = {
  fetchingById: {},
  viewersById: {},
  fetchingActiveLivestreams: boolean,
  activeLivestreams: ?LivestreamInfo,
  lastFetchedActiveLivestreams: number,
}

declare type LivestreamInfo = {
  [/* creatorId */ string]: {
    live: boolean,
    viewCount: number,
    creatorId: string,
    latestClaimId: string,
    latestClaimUri: string,
  }
}
