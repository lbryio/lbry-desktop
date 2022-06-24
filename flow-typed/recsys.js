declare type Recsys = {
  entries: { [ClaimId]: RecsysEntry },
  debug: boolean,

  saveEntries: () => void,
  onClickedRecommended: (parentClaimId: ClaimId, newClaimId: ClaimId) => void,
  onRecsLoaded: (claimId: ClaimId, uris: Array<string>, uuid: string) => void,
  createRecsysEntry: (claimId: ClaimId, parentUuid?: ?string, uuid?: string) => void,
  updateRecsysEntry: (claimId: ClaimId, key: string, value: string) => void,
  sendRecsysEntry: (claimId: ClaimId, isTentative?: boolean) => ?Promise<?Response>,
  sendEntries: (entries: ?{ [ClaimId]: RecsysEntry }, isResumedSend: boolean) => void,
  onRecsysPlayerEvent: (claimId: ClaimId, event: RecsysPlaybackEvent, isEmbedded: boolean) => void,
  log: (callName: string, claimId: ClaimId) => void,
  onPlayerDispose: (claimId: ClaimId, isEmbedded: boolean, totalPlayingTime: number) => void,
  onNavigate: () => void,
};

declare type RecsysEntry = {
  uuid: string,
  parentUuid?: string,
  claimId: string,
  uid?: number,
  deviceId?: number,
  pageLoadedAt: number,  // UNIX timestamp (in UTC)
  pageExitedAt: number,  // UNIX timestamp (in UTC)
  events: Array<RecsysPlaybackEvent>,
  recsysId: string,  // Recommender that produced recs
  recClaimIds: Array<string>, // Recommendations
  recClickedVideoIdx: Array<number>, // Video clicked index
  isEmbed: boolean,
  remoteIp: any,  // [bytes] Caller IP address
  tentative: boolean, // Visibility change rather than tab close
  autoplay: boolean,  // Was the last human action before this?
  commentPulls: number, // How many comment pull calls did the user request?
  recorded_at: number,
  user_agent: string,
  accept_lang: string,
  tokenVerified: boolean,
  totalPlayTime: number,
  finalPlayPosition: number,
  incognito: number, // User not logged in.
  isResumedSend: boolean, // Data sent after browser is re-opened.
};

declare type RecsysPlaybackEvent = {
  event: number, // 0 = start, 1 = stop, 2 = scrub, 3 = speed, 4 = end_of_play
  offset: number, // Where playback was at time of event
  arg: number,
};
