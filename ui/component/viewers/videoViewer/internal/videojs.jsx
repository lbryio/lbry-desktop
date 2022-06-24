// @flow
import 'videojs-contrib-ads'; // must be loaded in this order
import 'videojs-ima'; // loads directly after contrib-ads
import 'videojs-vtt-thumbnails';
import 'video.js/dist/alt/video-js-cdn.min.css';
import './plugins/videojs-mobile-ui/plugin';
import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
import '@silvermine/videojs-airplay/dist/silvermine-videojs-airplay.css';
import * as ICONS from 'constants/icons';
import { VIDEO_PLAYBACK_RATES } from 'constants/player';
import * as OVERLAY from './overlays';
import Button from 'component/button';
import classnames from 'classnames';
import events from './videojs-events';
import eventTracking from 'videojs-event-tracking';
import functions from './videojs-functions';
import hlsQualitySelector from './plugins/videojs-hls-quality-selector/plugin';
import keyboardShorcuts from './videojs-shortcuts';
import LbryPlaybackRateMenuButton from './lbry-playback-rate';
import LbryVolumeBarClass from './lbry-volume-bar';
import Chromecast from './chromecast';
import playerjs from 'player.js';
import qualityLevels from 'videojs-contrib-quality-levels';
import React, { useEffect, useRef, useState } from 'react';
import i18n from './plugins/videojs-i18n/plugin';
import recsys from './plugins/videojs-recsys/plugin';
// import runAds from './ads';
import videojs from 'video.js';
import { useIsMobile } from 'effects/use-screensize';
import { platform } from 'util/platform';
import usePersistedState from 'effects/use-persisted-state';

require('@silvermine/videojs-chromecast')(videojs);
require('@silvermine/videojs-airplay')(videojs);

export type Player = {
  // -- custom --
  claimSrcOriginal: ?{ src: string, type: string },
  claimSrcVhs: ?{ src: string, type: string },
  isLivestream?: boolean,
  // -- plugins ---
  mobileUi: (any) => void,
  chromecast: (any) => void,
  overlay: (any) => void,
  hlsQualitySelector: ?any,
  i18n: (any) => void,
  // -- base videojs --
  controlBar: {
    addChild: (string | any, ?any, ?number) => void,
    getChild: (string) => void,
    removeChild: (string) => void,
  },
  loadingSpinner: any,
  autoplay: (any) => boolean,
  tech: (?boolean) => { vhs: ?any },
  currentTime: (?number) => number,
  dispose: () => void,
  duration: () => number,
  ended: () => boolean,
  error: () => any,
  exitFullscreen: () => boolean,
  getChild: (string) => any,
  isFullscreen: () => boolean,
  muted: (?boolean) => boolean,
  on: (string, (any) => void) => void,
  off: (string, (any) => void) => void,
  one: (string, (any) => void) => void,
  play: () => Promise<any>,
  playbackRate: (?number) => number,
  readyState: () => number,
  requestFullscreen: () => boolean,
  src: ({ src: string, type: string }) => ?string,
  currentSrc: () => string,
  userActive: (?boolean) => boolean,
  volume: (?number) => number,
};

type Props = {
  adUrl: ?string,
  allowPreRoll: ?boolean,
  autoplay: boolean,
  claimId: ?string,
  title: ?string,
  channelTitle: string,
  embedded: boolean, // `/$/embed`
  embeddedInternal: boolean, // Markdown (Posts and Comments)
  internalFeatureEnabled: ?boolean,
  isAudio: boolean,
  poster: ?string,
  replay: boolean,
  shareTelemetry: boolean,
  source: string,
  sourceType: string,
  startMuted: boolean,
  userId: ?number,
  defaultQuality: ?string,
  onPlayerReady: (Player, any) => void,
  playNext: () => void,
  playPrevious: () => void,
  toggleVideoTheaterMode: () => void,
  claimRewards: () => void,
  doAnalyticsView: (string, number) => void,
  doAnalyticsBuffer: (string, any) => void,
  uri: string,
  claimValues: any,
  isLivestreamClaim: boolean,
  userClaimId: ?string,
  activeLivestreamForChannel: any,
  doToast: ({ message: string, linkText: string, linkTarget: string }) => void,
};

const VIDEOJS_VOLUME_PANEL_CLASS = 'VolumePanel';

const IS_IOS = platform.isIOS();
const IS_MOBILE = platform.isMobile();

const PLUGIN_MAP = {
  eventTracking: eventTracking,
  hlsQualitySelector: hlsQualitySelector,
  qualityLevels: qualityLevels,
  recsys: recsys,
  i18n: i18n,
};

Object.entries(PLUGIN_MAP).forEach(([pluginName, plugin]) => {
  if (!Object.keys(videojs.getPlugins()).includes(pluginName)) {
    videojs.registerPlugin(pluginName, plugin);
  }
});

// ****************************************************************************
// VideoJs
// ****************************************************************************

/*
properties for this component should be kept to ONLY those that if changed should REQUIRE an entirely new videojs element
 */
export default React.memo<Props>(function VideoJs(props: Props) {
  const {
    // adUrl, // TODO: this ad functionality isn't used, can be pulled out
    // allowPreRoll,
    autoplay,
    claimId,
    title,
    channelTitle,
    embedded,
    embeddedInternal,
    // internalFeatureEnabled, // for people on the team to test new features internally
    isAudio,
    poster,
    replay,
    shareTelemetry,
    source,
    sourceType,
    startMuted,
    userId,
    defaultQuality,
    onPlayerReady,
    playNext,
    playPrevious,
    toggleVideoTheaterMode,
    claimValues,
    doAnalyticsView,
    doAnalyticsBuffer,
    claimRewards,
    uri,
    userClaimId,
    isLivestreamClaim,
    activeLivestreamForChannel,
    doToast,
  } = props;

  // used to notify about default quality setting
  // if already has a quality set, no need to notify
  const [initialQualityChange, setInitialQualityChange] = usePersistedState(
    'initial-quality-change',
    Boolean(defaultQuality)
  );

  const isMobile = useIsMobile();

  const playerRef = useRef();
  const containerRef = useRef();
  const tapToUnmuteRef = useRef();
  const tapToRetryRef = useRef();
  const playerServerRef = useRef();
  const volumePanelRef = useRef();

  const keyDownHandlerRef = useRef();
  const videoScrollHandlerRef = useRef();
  const volumePanelScrollHandlerRef = useRef();

  const { url: livestreamVideoUrl } = activeLivestreamForChannel || {};
  const overrideNativeVhs = !platform.isIPhone();
  const showQualitySelector = (!isLivestreamClaim && overrideNativeVhs) || livestreamVideoUrl;

  // initiate keyboard shortcuts
  const {
    createKeyDownShortcutsHandler,
    createVideoScrollShortcutsHandler,
    createVolumePanelScrollShortcutsHandler,
  } = keyboardShorcuts({
    isMobile,
    isLivestreamClaim,
    toggleVideoTheaterMode,
    playNext,
    playPrevious,
  });

  const [reload, setReload] = useState('initial');

  const { createVideoPlayerDOM } = functions({ isAudio });

  const { unmuteAndHideHint, retryVideoAfterFailure, initializeEvents } = events({
    tapToUnmuteRef,
    tapToRetryRef,
    setReload,
    playerRef,
    replay,
    claimValues,
    userId,
    claimId,
    embedded,
    doAnalyticsView,
    doAnalyticsBuffer,
    claimRewards,
    uri,
    playerServerRef,
    isLivestreamClaim,
    channelTitle,
  });

  const videoJsOptions = {
    preload: 'auto',
    playbackRates: VIDEO_PLAYBACK_RATES,
    responsive: true,
    controls: true,
    html5: {
      vhs: {
        overrideNative: overrideNativeVhs, // !videojs.browser.IS_ANY_SAFARI,
        enableLowInitialPlaylist: false,
        fastQualityChange: true,
        useDtsForTimestampOffset: true,
      },
    },
    liveTracker: {
      trackingThreshold: 0,
      liveTolerance: 10,
    },
    inactivityTimeout: 2000,
    muted: startMuted,
    plugins: { eventTracking: true, overlay: OVERLAY.OVERLAY_DATA },
    controlBar: {
      currentTimeDisplay: true,
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: true,
      subsCapsButton: !IS_IOS,
    },
    techOrder: ['chromecast', 'html5'],
    ...Chromecast.getOptions(),
    bigPlayButton: embedded, // only show big play button if embedded
    suppressNotSupportedError: true,
    liveui: true,
  };

  // TODO: would be nice to pull this out into functions file
  // Initialize video.js
  function initializeVideoPlayer(domElement) {
    if (!domElement) return;

    const vjs = videojs(domElement, videoJsOptions, async () => {
      const player = playerRef.current;
      const adapter = new playerjs.VideoJSAdapter(player);

      // this seems like a weird thing to have to check for here
      if (!player) return;

      // runAds(internalFeatureEnabled, allowPreRoll, player, embedded);

      LbryVolumeBarClass.replaceExisting(player);
      LbryPlaybackRateMenuButton.replaceExisting(player);

      // Add reloadSourceOnError plugin
      player.reloadSourceOnError({ errorInterval: 10 });

      // Initialize mobile UI.
      player.mobileUi({
        fullscreen: {
          enterOnRotate: false,
        },
        touchControls: {
          seekSeconds: 10,
        },
      });

      player.i18n();

      // Add quality selector to player
      if (showQualitySelector) {
        player.hlsQualitySelector({
          displayCurrentQuality: true,
          originalHeight: claimValues?.video?.height,
          defaultQuality,
          initialQualityChange,
          setInitialQualityChange,
          doToast,
        });
      }

      // Add recsys plugin
      if (shareTelemetry) {
        player.recsys({
          videoId: claimId,
          userId: userId,
          embedded: embedded || embeddedInternal,
        });
      }

      // immediately show control bar while video is loading
      player.userActive(true);

      adapter.ready();

      Chromecast.initialize(player);
      player.airPlay();
    });

    // fixes #3498 (https://github.com/lbryio/lbry-desktop/issues/3498)
    // summary: on firefox the focus would stick to the fullscreen button which caused buggy behavior with spacebar
    vjs.on('fullscreenchange', () => document.activeElement && document.activeElement.blur());

    return vjs;
  }

  // useEffect(() => {
  //   if (showQualitySelector) {
  //     // Add quality selector to player
  //     const player = playerRef.current;
  //     if (player) player.hlsQualitySelector({ displayCurrentQuality: true });
  //   }
  // }, [showQualitySelector]);

  useEffect(() => {
    Chromecast.updateTitles(title, channelTitle);
  }, [title, channelTitle]);

  // This lifecycle hook is only called once (on mount), or when `isAudio` or `source` changes.
  useEffect(() => {
    (async function () {
      let vjsPlayer;
      const vjsParent = document.querySelector('.video-js-parent');

      let canUseOldPlayer = window.oldSavedDiv && vjsParent;
      const isLivestream = isLivestreamClaim && userClaimId;

      // initialize videojs if it hasn't been done yet
      if (!canUseOldPlayer) {
        const vjsElement = createVideoPlayerDOM(containerRef.current);
        vjsPlayer = initializeVideoPlayer(vjsElement);
        if (!vjsPlayer) {
          return;
        }

        // Add reference to player to global scope
        window.player = vjsPlayer;
      } else {
        vjsPlayer = window.player;
      }

      // hide unused elements on livestream
      if (isLivestream) {
        vjsPlayer.addClass('vjs-live');
        vjsPlayer.addClass('vjs-liveui');
        // $FlowIssue
        vjsPlayer.controlBar.currentTimeDisplay?.el().style.setProperty('display', 'none', 'important');
        // $FlowIssue
        vjsPlayer.controlBar.timeDivider?.el().style.setProperty('display', 'none', 'important');
        // $FlowIssue
        vjsPlayer.controlBar.durationDisplay?.el().style.setProperty('display', 'none', 'important');
      } else {
        vjsPlayer.removeClass('vjs-live');
        vjsPlayer.removeClass('vjs-liveui');
        // $FlowIssue
        vjsPlayer.controlBar.currentTimeDisplay?.el().style.setProperty('display', 'block', 'important');
        // $FlowIssue
        vjsPlayer.controlBar.timeDivider?.el().style.setProperty('display', 'block', 'important');
        // $FlowIssue
        vjsPlayer.controlBar.durationDisplay?.el().style.setProperty('display', 'block', 'important');
      }

      // Add recsys plugin
      if (shareTelemetry) {
        vjsPlayer.recsys.options_ = {
          videoId: claimId,
          userId: userId,
          embedded: embedded || embeddedInternal,
        };

        vjsPlayer.recsys.lastTimeUpdate = null;
        vjsPlayer.recsys.currentTimeUpdate = null;
        vjsPlayer.recsys.inPause = false;
        vjsPlayer.recsys.watchedDuration = { total: 0, lastTimestamp: -1 };
      }

      if (!embedded) {
        vjsPlayer.bigPlayButton && window.player.bigPlayButton.hide();
      } else {
        // $FlowIssue
        vjsPlayer.bigPlayButton?.show();
      }

      // I think this is a callback function
      const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');

      // add theatre and autoplay next button and initiate player events
      onPlayerReady(vjsPlayer, videoNode);

      // Set reference in component state
      playerRef.current = vjsPlayer;

      initializeEvents();

      // volume control div, used for changing volume when scrolled over
      // $FlowIssue
      volumePanelRef.current = playerRef.current?.controlBar?.getChild(VIDEOJS_VOLUME_PANEL_CLASS)?.el();

      const keyDownHandler = createKeyDownShortcutsHandler(playerRef, containerRef);
      const videoScrollHandler = createVideoScrollShortcutsHandler(playerRef, containerRef);
      const volumePanelHandler = createVolumePanelScrollShortcutsHandler(volumePanelRef, playerRef, containerRef);
      window.addEventListener('keydown', keyDownHandler);
      const containerDiv = containerRef.current;
      containerDiv && containerDiv.addEventListener('wheel', videoScrollHandler);
      if (volumePanelRef.current) volumePanelRef.current.addEventListener('wheel', volumePanelHandler);

      keyDownHandlerRef.current = keyDownHandler;
      videoScrollHandlerRef.current = videoScrollHandler;
      volumePanelScrollHandlerRef.current = volumePanelHandler;

      // $FlowIssue
      vjsPlayer.controlBar?.show();

      vjsPlayer.poster(poster);

      vjsPlayer.el().childNodes[0].setAttribute('playsinline', '');

      let contentUrl;
      // TODO: pull this function into videojs-functions
      // determine which source to use and load it
      if (isLivestream) {
        vjsPlayer.isLivestream = true;
        vjsPlayer.addClass('livestreamPlayer');
        vjsPlayer.src({ type: 'application/x-mpegURL', src: livestreamVideoUrl });
      } else {
        vjsPlayer.isLivestream = false;
        vjsPlayer.removeClass('livestreamPlayer');

        // change to m3u8 if applicable
        const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });
        playerServerRef.current = response.headers.get('x-powered-by');
        vjsPlayer.claimSrcOriginal = { type: sourceType, src: source };

        if (response && response.redirected && response.url && response.url.endsWith('m3u8')) {
          vjsPlayer.claimSrcVhs = { type: 'application/x-mpegURL', src: response.url };
          vjsPlayer.src(vjsPlayer.claimSrcVhs);

          contentUrl = response.url;
        } else {
          vjsPlayer.src(vjsPlayer.claimSrcOriginal);
        }
      }

      // bugfix thumbnails showing up if new video doesn't have them
      if (typeof vjsPlayer.vttThumbnails.detach === 'function') {
        vjsPlayer.vttThumbnails.detach();
      }

      // initialize hover thumbnails
      if (contentUrl) {
        const trimmedPath = contentUrl.substring(0, contentUrl.lastIndexOf('/'));
        const thumbnailPath = trimmedPath + '/stream_sprite.vtt';

        // progress bar hover thumbnails
        if (!IS_MOBILE) {
          // if src is a function, it's already been initialized
          if (typeof vjsPlayer.vttThumbnails.src === 'function') {
            vjsPlayer.vttThumbnails.src(thumbnailPath);
          } else {
            // otherwise, initialize plugin
            vjsPlayer.vttThumbnails({
              src: thumbnailPath,
              showTimestamp: true,
            });
          }
        }
      }

      vjsPlayer.load();

      if (canUseOldPlayer) {
        // $FlowIssue
        document.querySelector('.video-js-parent')?.append(window.oldSavedDiv);
      }

      // allow tap to unmute if no perms on iOS
      if (autoplay && !embedded) {
        const promise = vjsPlayer.play();

        window.player.userActive(true);

        if (promise !== undefined) {
          promise
            .then((_) => {
              // $FlowIssue
              vjsPlayer?.controlBar.el().classList.add('vjs-transitioning-video');
            })
            .catch((error) => {
              const noPermissionError = typeof error === 'object' && error.name && error.name === 'NotAllowedError';

              if (noPermissionError) {
                if (IS_IOS) {
                  // autoplay not allowed, mute video, play and show 'tap to unmute' button
                  // $FlowIssue
                  vjsPlayer?.muted(true);
                  // $FlowIssue
                  const mutedPlayPromise = vjsPlayer?.play();
                  if (mutedPlayPromise !== undefined) {
                    mutedPlayPromise
                      .then(() => {
                        const tapToUnmuteButton = document.querySelector('.video-js--tap-to-unmute');

                        // $FlowIssue
                        tapToUnmuteButton?.style.setProperty('visibility', 'visible');
                        // $FlowIssue
                        tapToUnmuteButton?.style.setProperty('display', 'inline', 'important');
                      })
                      .catch((error) => {
                        // $FlowFixMe
                        vjsPlayer?.addClass('vjs-paused');
                        // $FlowFixMe
                        vjsPlayer?.addClass('vjs-has-started');

                        // $FlowFixMe
                        document.querySelector('.vjs-touch-overlay')?.classList.add('show-play-toggle');
                        // $FlowFixMe
                        document.querySelector('.vjs-play-control')?.classList.add('vjs-paused');
                      });
                  }
                } else {
                  // $FlowIssue
                  vjsPlayer?.bigPlayButton?.show();
                }
              }
            });
        }
      }
    })();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', keyDownHandlerRef.current);

      const containerDiv = containerRef.current;
      // $FlowFixMe
      containerDiv && containerDiv.removeEventListener('wheel', videoScrollHandlerRef.current);

      if (volumePanelRef.current) {
        volumePanelRef.current.removeEventListener('wheel', volumePanelScrollHandlerRef.current);
      }

      const chapterMarkers = document.getElementsByClassName('vjs-chapter-marker');
      while (chapterMarkers.length > 0) {
        // $FlowIssue
        chapterMarkers[0].parentNode?.removeChild(chapterMarkers[0]);
      }

      const player = playerRef.current;

      if (player) {
        try {
          window.cast.framework.CastContext.getInstance().getCurrentSession().endSession(false);
        } catch {}

        window.player.switchedFromDefaultQuality = false;

        window.player.userActive(false);
        window.player.pause();

        if (IS_IOS) {
          // $FlowIssue
          window.player.controlBar?.playToggle?.hide();
        }

        // this solves an issue with portrait videos
        // $FlowIssue
        const videoDiv = window.player?.tech_?.el(); // video element
        if (videoDiv) videoDiv.style.top = '0px';

        window.player.controlBar.el().classList.add('vjs-transitioning-video');

        window.oldSavedDiv = window.player.el();

        window.player.trigger('playerClosed');

        // stop streams running in background
        window.player.loadTech_('html5', null);

        window.player.currentTime(0);

        // makes the current time update immediately
        window.player.trigger('timeupdate');

        window.player.claimSrcVhs = null;
      }
    };
  }, [isAudio, source, reload, userClaimId, isLivestreamClaim]);

  return (
    <div className={classnames('video-js-parent', { 'video-js-parent--ios': IS_IOS })} ref={containerRef}>
      <Button
        label={__('Tap to unmute')}
        button="link"
        icon={ICONS.VOLUME_MUTED}
        className="video-js--tap-to-unmute"
        onClick={unmuteAndHideHint}
        ref={tapToUnmuteRef}
      />
      <Button
        label={__('Retry')}
        button="link"
        icon={ICONS.REFRESH}
        className="video-js--tap-to-unmute"
        onClick={retryVideoAfterFailure}
        ref={tapToRetryRef}
      />
    </div>
  );
});
