/* eslint-disable */
import window from 'global/window';
import Config from './config';
import Playlist from './playlist';

// Utilities

/**
 * Returns the CSS value for the specified property on an element
 * using `getComputedStyle`. Firefox has a long-standing issue where
 * getComputedStyle() may return null when running in an iframe with
 * `display: none`.
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 * @param {HTMLElement} el the htmlelement to work on
 * @param {string} the proprety to get the style for
 */
const safeGetComputedStyle = function(el, property) {
  if (!el) {
    return '';
  }

  const result = window.getComputedStyle(el);

  if (!result) {
    return '';
  }

  return result[property];
};

/**
 * Resuable stable sort function
 *
 * @param {Playlists} array
 * @param {Function} sortFn Different comparators
 * @function stableSort
 */
const stableSort = function(array, sortFn) {
  const newArray = array.slice();

  array.sort(function(left, right) {
    const cmp = sortFn(left, right);

    if (cmp === 0) {
      return newArray.indexOf(left) - newArray.indexOf(right);
    }
    return cmp;
  });
};

/**
 * Chooses the appropriate media playlist based on bandwidth and player size
 *
 * @param {Object} master
 *        Object representation of the master manifest
 * @param {number} playerBandwidth
 *        Current calculated bandwidth of the player
 * @param {number} playerWidth
 *        Current width of the player element (should account for the device
 *   pixel ratio)
 * @param {number} playerHeight
 *        Current height of the player element (should account for the device
 *   pixel ratio)
 * @param {boolean} limitRenditionByPlayerDimensions
 *        True if the player width and height should be used during the
 *   selection, false otherwise
 * @return {Playlist} the highest bitrate playlist less than the
 * currently detected bandwidth, accounting for some amount of
 * bandwidth variance
 */
export const simpleSelector = function(
  master,
  playerBandwidth,
  playerWidth,
  playerHeight,
  limitRenditionByPlayerDimensions
) {
  // convert the playlists to an intermediary representation to make comparisons easier
  let sortedPlaylistReps = master.playlists.map((playlist) => {
    let bandwidth;
    const width = playlist.attributes.RESOLUTION && playlist.attributes.RESOLUTION.width;
    const height = playlist.attributes.RESOLUTION && playlist.attributes.RESOLUTION.height;

    bandwidth = playlist.attributes.BANDWIDTH;

    bandwidth = bandwidth || window.Number.MAX_VALUE;

    return {
      bandwidth,
      width,
      height,
      playlist
    };
  });

  stableSort(sortedPlaylistReps, (left, right) => left.bandwidth - right.bandwidth);

  // filter out any playlists that have been excluded due to
  // incompatible configurations
  sortedPlaylistReps = sortedPlaylistReps.filter((rep) => !Playlist.isIncompatible(rep.playlist));

  // filter out any playlists that have been disabled manually through the representations
  // api or blacklisted temporarily due to playback errors.
  let enabledPlaylistReps = sortedPlaylistReps.filter((rep) => Playlist.isEnabled(rep.playlist));

  if (!enabledPlaylistReps.length) {
    // if there are no enabled playlists, then they have all been blacklisted or disabled
    // by the user through the representations api. In this case, ignore blacklisting and
    // fallback to what the user wants by using playlists the user has not disabled.
    enabledPlaylistReps = sortedPlaylistReps.filter((rep) => !Playlist.isDisabled(rep.playlist));
  }

  // filter out any variant that has greater effective bitrate
  // than the current estimated bandwidth
  const bandwidthPlaylistReps = enabledPlaylistReps.filter((rep) => rep.bandwidth * Config.BANDWIDTH_VARIANCE < playerBandwidth);

  let highestRemainingBandwidthRep =
    bandwidthPlaylistReps[bandwidthPlaylistReps.length - 1];

  // get all of the renditions with the same (highest) bandwidth
  // and then taking the very first element
  const bandwidthBestRep = bandwidthPlaylistReps.filter((rep) => rep.bandwidth === highestRemainingBandwidthRep.bandwidth)[0];

  // if we're not going to limit renditions by player size, make an early decision.
  if (limitRenditionByPlayerDimensions === false) {
    const chosenRep = (
      bandwidthBestRep ||
      enabledPlaylistReps[0] ||
      sortedPlaylistReps[0]
    );

    return chosenRep ? chosenRep.playlist : null;
  }

  // filter out playlists without resolution information
  const haveResolution = bandwidthPlaylistReps.filter((rep) => rep.width && rep.height);

  // sort variants by resolution
  stableSort(haveResolution, (left, right) => left.width - right.width);

  // if we have the exact resolution as the player use it
  const resolutionBestRepList = haveResolution.filter((rep) => rep.width === playerWidth && rep.height === playerHeight);

  highestRemainingBandwidthRep = resolutionBestRepList[resolutionBestRepList.length - 1];
  // ensure that we pick the highest bandwidth variant that have exact resolution
  const resolutionBestRep = resolutionBestRepList.filter((rep) => rep.bandwidth === highestRemainingBandwidthRep.bandwidth)[0];

  let resolutionPlusOneList;
  let resolutionPlusOneSmallest;
  let resolutionPlusOneRep;

  // find the smallest variant that is larger than the player
  // if there is no match of exact resolution
  if (!resolutionBestRep) {
    resolutionPlusOneList = haveResolution.filter((rep) => rep.width > playerWidth || rep.height > playerHeight);

    // find all the variants have the same smallest resolution
    resolutionPlusOneSmallest = resolutionPlusOneList.filter((rep) => rep.width === resolutionPlusOneList[0].width &&
               rep.height === resolutionPlusOneList[0].height);

    // ensure that we also pick the highest bandwidth variant that
    // is just-larger-than the video player
    highestRemainingBandwidthRep =
      resolutionPlusOneSmallest[resolutionPlusOneSmallest.length - 1];
    resolutionPlusOneRep = resolutionPlusOneSmallest.filter((rep) => rep.bandwidth === highestRemainingBandwidthRep.bandwidth)[0];
  }

  // fallback chain of variants
  const chosenRep = (
    resolutionPlusOneRep ||
    resolutionBestRep ||
    bandwidthBestRep ||
    enabledPlaylistReps[0] ||
    sortedPlaylistReps[0]
  );

  return chosenRep ? chosenRep.playlist : null;
};

// Playlist Selectors

/**
 * Chooses the appropriate media playlist based on the most recent
 * bandwidth estimate and the player size.
 *
 * Expects to be called within the context of an instance of VhsHandler
 *
 * @return {Playlist} the highest bitrate playlist less than the
 * currently detected bandwidth, accounting for some amount of
 * bandwidth variance
 */
export const lastBandwidthSelector = function() {
  const pixelRatio = this.useDevicePixelRatio ? window.devicePixelRatio || 1 : 1;

  const selectedBandwidth = simpleSelector(
    this.playlists.master,
    this.systemBandwidth,
    parseInt(safeGetComputedStyle(this.tech_.el(), 'width'), 10) * pixelRatio,
    parseInt(safeGetComputedStyle(this.tech_.el(), 'height'), 10) * pixelRatio,
    this.limitRenditionByPlayerDimensions
  );

  const player = this.player_;
  const hlsQualitySelector = player.hlsQualitySelector;
  const originalHeight = hlsQualitySelector.config.originalHeight;

  if (hlsQualitySelector?.getCurrentQuality() === 'auto') {
    const qualityLabel = selectedBandwidth.attributes.RESOLUTION.height + 'p';
    hlsQualitySelector._qualityButton.menuButton_.$('.vjs-icon-placeholder').innerHTML = `<span>${__('Auto --[Video quality. Short form]--')}<span>${qualityLabel}</span></span>`;
  }

  return selectedBandwidth;
};
