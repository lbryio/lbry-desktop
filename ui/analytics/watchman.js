// @flow
import { SDK_API_PATH } from 'config';

const isProduction = process.env.NODE_ENV === 'production';
const WATCHMAN_BACKEND_ENDPOINT = 'https://watchman.na-backend.odysee.com/reports/playback';
const SEND_DATA_TO_WATCHMAN_INTERVAL = 10; // in seconds

let gWatchmanAnalyticsEnabled = false;

// variables initialized for watchman
let amountOfBufferEvents = 0;
let amountOfBufferTimeInMS = 0;
let videoType, userId, claimUrl, playerPoweredBy, videoPlayer, bitrateAsBitsPerSecond, isLivestream;
let lastSentTime;

// calculate data for backend, send them, and reset buffer data for next interval
async function sendAndResetWatchmanData() {
  if (!userId) {
    return 'Can only be used with a user id';
  }

  if (!videoPlayer) {
    return 'Video player not initialized';
  }

  let timeSinceLastIntervalSend = new Date() - lastSentTime;
  lastSentTime = new Date();

  let protocol;
  if (videoType === 'application/x-mpegURL' && !isLivestream) {
    protocol = 'hls';
    // get bandwidth if it exists from the texttrack (so it's accurate if user changes quality)
    // $FlowFixMe
    bitrateAsBitsPerSecond = videoPlayer.tech(true).vhs?.playlists?.media?.().attributes?.BANDWIDTH;
  } else if (isLivestream) {
    protocol = 'lvs';
    // $FlowFixMe
    bitrateAsBitsPerSecond = videoPlayer.tech(true).vhs?.playlists?.media?.().attributes?.BANDWIDTH;
  } else {
    protocol = 'stb';
  }

  // current position in video in MS
  const positionInVideo = isLivestream ? 0 : videoPlayer && Math.round(videoPlayer.currentTime()) * 1000;

  // get the duration marking the time in the video for relative position calculation
  const totalDurationInSeconds = isLivestream ? 0 : videoPlayer && Math.round(videoPlayer.duration());

  // temp: if buffering over the interval, the duration doesn't reset since we don't get an event
  if (amountOfBufferTimeInMS > timeSinceLastIntervalSend) amountOfBufferTimeInMS = timeSinceLastIntervalSend;

  // build object for watchman backend
  const objectToSend = {
    rebuf_count: amountOfBufferEvents,
    rebuf_duration: amountOfBufferTimeInMS,
    url: claimUrl.replace('lbry://', ''),
    device: 'web',
    duration: timeSinceLastIntervalSend,
    protocol,
    player: playerPoweredBy,
    user_id: userId.toString(),
    position: isLivestream ? 0 : Math.round(positionInVideo),
    rel_position: isLivestream ? 0 : Math.round((positionInVideo / (totalDurationInSeconds * 1000)) * 100),
    bitrate: bitrateAsBitsPerSecond,
    bandwidth: undefined,
    // ...(userDownloadBandwidthInBitsPerSecond && {bandwidth: userDownloadBandwidthInBitsPerSecond}), // add bandwidth if populated
  };

  // post to watchman
  await sendWatchmanData(objectToSend);

  // reset buffer data
  amountOfBufferEvents = 0;
  amountOfBufferTimeInMS = 0;
}

let watchmanInterval;
// clear watchman interval and mark it as null (when video paused)
function stopWatchmanInterval() {
  clearInterval(watchmanInterval);
  watchmanInterval = null;
}

// creates the setInterval that will run send to watchman on recurring basis
function startWatchmanIntervalIfNotRunning() {
  if (!watchmanInterval) {
    // instantiate the first time to calculate duration from
    lastSentTime = new Date();

    // only set an interval if analytics are enabled and is prod
    if (isProduction && gWatchmanAnalyticsEnabled) {
      watchmanInterval = setInterval(sendAndResetWatchmanData, 1000 * SEND_DATA_TO_WATCHMAN_INTERVAL);
    }
  }
}

// post data to the backend
async function sendWatchmanData(body) {
  try {
    const response = await fetch(WATCHMAN_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (err) {}
}

// ****************************************************************************
// ****************************************************************************

export type Watchman = {
  setState: (enable: boolean) => void,
  videoStartEvent: (?string, number, string, ?number, string, any, ?number, boolean) => void,
  videoIsPlaying: (boolean, any) => void,
  videoBufferEvent: (
    StreamClaim,
    {
      timeAtBuffer: number,
      bufferDuration: number,
      bitRate: number,
      duration: number,
      userId: string,
      playerPoweredBy: string,
      readyState: number,
      isLivestream: boolean,
    }
  ) => Promise<any>,
};

export const watchman: Watchman = {
  setState: (enable: boolean) => {
    gWatchmanAnalyticsEnabled = enable;
  },
  /**
   * Is told whether video is being started or paused, and adjusts interval accordingly
   * @param {boolean} isPlaying - Whether video was started or paused
   * @param {object} passedPlayer - VideoJS Player object
   */
  videoIsPlaying: (isPlaying, passedPlayer) => {
    let playerIsSeeking = false;
    // have to use this because videojs pauses/unpauses during seek
    // sometimes the seeking function isn't populated yet so check for it as well
    if (passedPlayer && passedPlayer.seeking) {
      playerIsSeeking = passedPlayer.seeking();
    }

    // if being paused, and not seeking, send existing data and stop interval
    if (!isPlaying && !playerIsSeeking) {
      sendAndResetWatchmanData();
      stopWatchmanInterval();
      // if being told to pause, and seeking, send and restart interval
    } else if (!isPlaying && playerIsSeeking) {
      sendAndResetWatchmanData();
      stopWatchmanInterval();
      startWatchmanIntervalIfNotRunning();
      // is being told to play, and seeking, don't do anything,
      // assume it's been started already from pause
    } else if (isPlaying && playerIsSeeking) {
      // start but not a seek, assuming a start from paused content
    } else if (isPlaying && !playerIsSeeking) {
      startWatchmanIntervalIfNotRunning();
    }
  },
  // receive buffer events from tracking plugin and save buffer amounts and times for backend call
  videoBufferEvent: async (claim, data) => {
    amountOfBufferEvents = amountOfBufferEvents + 1;
    amountOfBufferTimeInMS = amountOfBufferTimeInMS + data.bufferDuration;
  },
  videoStartEvent: (
    claimId,
    timeToStartVideo,
    poweredBy,
    passedUserId,
    canonicalUrl,
    passedPlayer,
    videoBitrate,
    isLivestreamClaim
  ) => {
    // populate values for watchman when video starts
    userId = passedUserId;
    claimUrl = canonicalUrl;
    playerPoweredBy = poweredBy;
    isLivestream = isLivestreamClaim;

    videoType = passedPlayer.currentSource().type;
    videoPlayer = passedPlayer;
    bitrateAsBitsPerSecond = videoBitrate;
    !isLivestreamClaim && sendPromMetric('time_to_start', timeToStartVideo, playerPoweredBy);
  },
  onDispose: () => {
    stopWatchmanInterval();
  },
};

function sendPromMetric(name: string, value?: number, player: string) {
  if (gWatchmanAnalyticsEnabled) {
    let url = new URL(SDK_API_PATH + '/metric/ui');
    const params = { name: name, value: value ? value.toString() : '', player: player };
    url.search = new URLSearchParams(params).toString();
    return fetch(url, { method: 'post' }).catch(function (error) {});
  }
}
