// @flow
import * as RENDER_MODES from 'constants/file_render_modes';

const isProduction = process.env.NODE_ENV === 'production';

// --- GA ---
// - Events: 500 max (cannot be deleted).
// - Dimensions: 25 max (cannot be deleted, but can be "archived"). Usually
//               tied to an event parameter for reporting purposes.
//
// Given the limitations above, we need to plan ahead before adding new Events
// and Parameters.
//
// Events:
// - Find a Recommended Event that is closest to what you need.
//   https://support.google.com/analytics/answer/9267735?hl=en
// - If doesn't exist, use a Custom Event.
//
// Parameters:
// - Custom parameters don't appear in automated reports until they are tied to
//   a Dimension.
// - Add your entry to GA_DIMENSIONS below -- tt allows us to keep track so that
//   we don't exceed the limit. Re-use existing parameters if possible.
// - Register the Dimension in GA Console to make it visible in reports.
export const GA_DIMENSIONS = {
  TYPE: 'type',
  ACTION: 'action',
  VALUE: 'value',
  START_TIME_MS: 'start_time_ms',
  DURATION_MS: 'duration_ms',
  END_TIME_MS: 'end_time_ms',
};

let gAppStartTime = 0;
let gStartTimeByEvent = {};
let gGoogleAnalyticsOn = false;

export type Events = {
  setState: (enable: boolean) => void,
  setUser: (userId: string) => void,
  // ------
  report: (string, any) => void,
  // ------
  adsFetched: () => void,
  emailProvided: () => void,
  emailVerified: () => void,
  openUrl: (string) => void,
  playerLoaded: (string, ?boolean) => void,
  playerVideoStarted: (?boolean) => void,
  purchase: (number) => void,
  rewardEligible: () => void,
  startup: (time: number) => void,
  tagFollow: (string, boolean, ?string) => void,
  trendingAlgorithm: (trendingAlgorithm: string) => void,
  // ------
  initAppStartTime: (startTime: number) => void,
  // ------
  eventStarted: (name: string, time: number, id?: string) => void,
  eventCompleted: (name: string, time: number, id?: string) => void,
};

export const events: Events = {
  setState: (enable: boolean) => {
    gGoogleAnalyticsOn = enable && isProduction && window.gtag;

    if (gGoogleAnalyticsOn) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    }

    // TODO: If we turn off at runtime, do we need to toggle window.gtag?
    // Not thinking about it now since we are removing GA anyway.
  },

  setUser: (userId: string) => {
    if (gGoogleAnalyticsOn && userId) {
      window.gtag('set', { user_id: userId });
    }
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  report: (event: string, params?: { [string]: string | number }) => {
    sendGaEvent(event, params);
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  adsFetched: () => {
    sendGaEvent('ad_fetched');
  },

  emailProvided: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'email_provided',
    });
  },

  emailVerified: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'email_verified',
    });
  },

  openUrl: (url: string) => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'open_url',
      url,
    });
  },

  playerLoaded: (renderMode, embedded) => {
    const RENDER_MODE_TO_EVENT = (renderMode) => {
      switch (renderMode) {
        case RENDER_MODES.VIDEO:
          return 'loaded_video';
        case RENDER_MODES.AUDIO:
          return 'loaded_audio';
        case RENDER_MODES.MARKDOWN:
          return 'loaded_markdown';
        case RENDER_MODES.IMAGE:
          return 'loaded_image';
        case 'livestream':
          return 'loaded_livestream';
        default:
          return 'loaded_misc';
      }
    };

    sendGaEvent('player', {
      [GA_DIMENSIONS.ACTION]: RENDER_MODE_TO_EVENT(renderMode),
      [GA_DIMENSIONS.TYPE]: embedded ? 'embedded' : 'onsite',
    });
  },

  playerVideoStarted: (embedded) => {
    sendGaEvent('player', {
      [GA_DIMENSIONS.ACTION]: 'started_video',
      [GA_DIMENSIONS.TYPE]: embedded ? 'embedded' : 'onsite',
    });
  },

  purchase: (purchaseInt: number) => {
    sendGaEvent('purchase', {
      // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
      [GA_DIMENSIONS.VALUE]: purchaseInt,
    });
  },

  rewardEligible: () => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'reward_eligible',
    });
  },

  startup: (time: number) => {
    if (gAppStartTime !== 0) {
      sendGaEvent('diag_app_ready', {
        [GA_DIMENSIONS.DURATION_MS]: time - gAppStartTime,
      });
    }
  },

  tagFollow: (tag, following) => {
    sendGaEvent('tags', {
      [GA_DIMENSIONS.ACTION]: following ? 'follow' : 'unfollow',
      [GA_DIMENSIONS.VALUE]: tag,
    });
  },

  trendingAlgorithm: (trendingAlgorithm: string) => {
    sendGaEvent('engagement', {
      [GA_DIMENSIONS.TYPE]: 'trending_algorithm',
      trending_algorithm: trendingAlgorithm,
    });
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  initAppStartTime: (startTime: number) => {
    gAppStartTime = startTime;
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  eventStarted: (name: string, time: number, id?: string) => {
    const key = id || name;
    gStartTimeByEvent[key] = time;
  },

  eventCompleted: (name: string, time: number, id?: string) => {
    const key = id || name;
    if (gStartTimeByEvent[key]) {
      sendGaEvent(name, {
        [GA_DIMENSIONS.START_TIME_MS]: gStartTimeByEvent[key] - gAppStartTime,
        [GA_DIMENSIONS.DURATION_MS]: time - gStartTimeByEvent[key],
        [GA_DIMENSIONS.END_TIME_MS]: time - gAppStartTime,
      });

      delete gStartTimeByEvent[key];
    }
  },
};

// ****************************************************************************
// ****************************************************************************

function sendGaEvent(event: string, params?: { [string]: string | number }) {
  if (gGoogleAnalyticsOn) {
    window.gtag('event', event, params);
  }
}
