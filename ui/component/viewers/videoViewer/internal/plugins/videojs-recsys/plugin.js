// Created by xander on 6/21/2021
import videojs from 'video.js/dist/video.min.js';
import { v4 as uuidV4 } from 'uuid';
const VERSION = '0.0.1';

const recsysEndpoint = 'https://clickstream.odysee.com/log/video/view';
const recsysId = 'lighthouse-v0';

/* RecSys */
const RecsysData = {
  event: {
    start: 0,
    stop: 1,
    scrub: 2,
    speed: 3,
  },
};

function createRecsys(claimId, userId, events, loadedAt, isEmbed) {
  // TODO: use a UUID generator
  const uuid = uuidV4();
  const pageLoadedAt = loadedAt;
  const pageExitedAt = Date.now();
  return {
    uuid: uuid,
    parentUuid: null,
    uid: userId,
    claimId: claimId,
    pageLoadedAt: pageLoadedAt,
    pageExitedAt: pageExitedAt,
    recsysId: recsysId,
    recClaimIds: null,
    recClickedVideoIdx: null,
    events: events,
    isEmbed: isEmbed,
  };
}

function newRecsysEvent(eventType, offset, arg) {
  if (arg) {
    return {
      event: eventType,
      offset: offset,
      arg: arg,
    };
  } else {
    return {
      event: eventType,
      offset: offset,
    };
  }
}

function sendRecsysEvents(recsys) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // application/json
    body: JSON.stringify(recsys),
  };

  try {
    fetch(recsysEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(`Recsys response data:`, data);
      });
  } catch (error) {
    // console.error(`Recsys Error`, error);
  }
}

const defaults = {
  endpoint: recsysEndpoint,
  recsysId: recsysId,
  videoId: null,
  userId: 0,
  debug: false,
};

const Component = videojs.getComponent('Component');
const registerPlugin = videojs.registerPlugin || videojs.plugin;

class RecsysPlugin extends Component {
  constructor(player, options) {
    super(player, options);

    // Plugin started
    if (options.debug) {
      this.log(`Created recsys plugin for: videoId:${options.videoId}, userId:${options.userId}`);
    }

    // To help with debugging, we'll add a global vjs object with the video js player
    window.vjs = player;

    this.player = player;

    this.recsysEvents = [];
    this.lastTimeUpdate = null;
    this.currentTimeUpdate = null;
    this.loadedAt = Date.now();
    this.playInitiated = false;

    // Plugin event listeners
    player.on('playing', (event) => this.onPlay(event));
    player.on('pause', (event) => this.onPause(event));
    player.on('ended', (event) => this.onEnded(event));
    player.on('ratechange', (event) => this.onRateChange(event));
    player.on('timeupdate', (event) => this.onTimeUpdate(event));
    player.on('seeked', (event) => this.onSeeked(event));

    // Event trigger to send recsys event
    player.on('dispose', (event) => this.onDispose(event));
  }

  addRecsysEvent(recsysEvent) {
    if (!this.playInitiated) {
      switch (recsysEvent.event) {
        case RecsysData.event.start:
          this.playInitiated = true;
          break;
        case RecsysData.event.scrub:
          // If playback hasn't started, swallow scrub events. They offer some
          // information, but if there isn't a subsequent play event, it's
          // mostly nonsensical.
          return undefined;
        case RecsysData.event.stop:
          // If playback hasn't started, swallow stop events. This means
          // you're going to start from an offset but the start event
          // captures that information. (With the ambiguity that you can't
          // tell if they scrubbed, landed at the offset, or restarted. But
          // I don't think that matters much.)
          return undefined;
        case RecsysData.event.speed:
          if (this.recsysEvents.length > 0 && this.recsysEvents[0].event === RecsysData.event.speed) {
            // video.js will sometimes fire the default play speed followed by the
            // user preference. This is not useful information so we can keep the latter.
            this.recsysEvents.pop();
          }
      }
    } else {
      const lastEvent = this.recsysEvents[this.recsysEvents.length - 1];

      switch (recsysEvent.event) {
        case RecsysData.event.scrub:
          if (lastEvent.event === RecsysData.event.stop) {
            // Video.js fires a stop before the seek. This extra information isn't
            // useful to log though, so this code prunes the stop event if it was
            // within 0.25 seconds.
            if (Math.abs(lastEvent.offset - recsysEvent.offset) < 0.25) {
              this.recsysEvents.pop();
              recsysEvent.offset = lastEvent.arg;
            }
          } else if (lastEvent.event === RecsysData.event.start) {
            // If the last event was a play and this event is a scrub close to
            // that play position, I think it's just a weird emit order for
            // video.js and we don't need to log the scrub.
            if (Math.abs(lastEvent.offset - recsysEvent.arg) < 0.25) {
              return undefined;
            }
          }
          break;
        case RecsysData.event.start:
          if (lastEvent.event === RecsysData.event.scrub) {
            // If the last event was a seek and this is a play,
            // it's reasonable to just implicitly assume the play occurred,
            // no need to create the play event.
            return undefined;
          } else if (lastEvent.event === RecsysData.event.start) {
            // A start followed by a start is a buffering event.
            // It may make sense to keep these. A user may abandon
            // a page *not because it's bad content but because
            // there are network troubles right now*.
          }
          break;
      }
    }

    this.recsysEvents.push(recsysEvent);
  }

  getRecsysEvents() {
    return this.recsysEvents.map((event) => {
      if (event !== RecsysData.event.stop) {
        return event;
      }

      // I used the arg in stop events to smuggle the seek time into
      // the scrub events. But the backend doesn't expect it.
      const dup = { ...event };
      delete dup.arg;
      return dup;
    });
  }

  sendRecsysEvents() {
    const event = createRecsys(
      this.options_.videoId,
      this.options_.userId,
      this.getRecsysEvents(),
      this.loadedAt,
      false
    );
    sendRecsysEvents(event);
  }

  onPlay(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.start, this.player.currentTime());
    this.log('onPlay', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onPause(event) {
    // The API doesn't want an `arg` for `STOP` events. However, video.js
    // emits these before the seek events, and that seems to be the easiest
    // way to lift time you are seeking from into the scrub record (via lastTimeUpdate).
    // Hacky, but works.
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime(), this.lastTimeUpdate);
    this.log('onPause', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onEnded(event) {
    const recsysEvent = newRecsysEvent(RecsysData.event.stop, this.player.currentTime());
    this.log('onEnded', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onRateChange(event) {
    // This is actually a bug. The offset should be the offset. The change speed should be change speed.
    // Otherise, you don't know where it changed and the time calc is wrong.
    const recsysEvent = newRecsysEvent(RecsysData.event.speed, this.player.currentTime(), this.player.playbackRate());
    this.log('onRateChange', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onTimeUpdate(event) {
    this.lastTimeUpdate = this.currentTimeUpdate;
    this.currentTimeUpdate = this.player.currentTime();
  }

  onSeeked(event) {
    // The problem? `lastTimeUpdate` is wrong.
    // So every seeks l

    // If the immediately prior event is a pause?
    const recsysEvent = newRecsysEvent(RecsysData.event.scrub, this.lastTimeUpdate, this.player.currentTime());
    this.log('onSeeked', recsysEvent);
    this.addRecsysEvent(recsysEvent);
  }

  onDispose(event) {
    this.sendRecsysEvents();
  }

  log(...args) {
    if (this.options_.debug) {
      // console.log(`Recsys Debug:`, JSON.stringify(args));
    }
  }
}

videojs.registerComponent('recsys', RecsysPlugin);

const onPlayerReady = (player, options) => {
  player.recsys = new RecsysPlugin(player, options);
};

/**
 * Initialize the plugin.
 *
 * @function plugin
 * @param    {Object} [options={}]
 */
const plugin = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

plugin.VERSION = VERSION;

registerPlugin('recsys', plugin);

export default plugin;
