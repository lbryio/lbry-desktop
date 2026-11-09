type LivestreamReplayItem = {
  data: {
    claimId: string;
    deleted: boolean;
    deletedAt: string | null | undefined;
    ffprobe: any;
    fileDuration: number; // decimal? float? string?
    fileType: string;
    fileLocation: string;
    fileSize: number;
    key: string;
    published: boolean;
    publishedAt: string | null | undefined;
    service: string;
    thumbnails: Array<string>;
    uploadedAt: string; // Date?
  };
  id: string;
};

type LivestreamReplayData = Array<LivestreamReplayItem>;

type LivestreamState = {
  fetchingById: {};
  viewersById: {};
  fetchingActiveLivestreams: boolean;
  activeLivestreams: LivestreamInfo | null | undefined;
  activeLivestreamsLastFetchedDate: number;
  activeLivestreamsLastFetchedOptions: {};
};

type LivestreamInfo = {
  [creatorId: string]: {
    live: boolean;
    viewCount: number;
    creatorId: string;
    latestClaimId: string;
    latestClaimUri: string;
  };
};
