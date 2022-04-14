/**
 * @file playlist.js
 *
 * Playlist related utilities.
 */

/**
 * Check whether the playlist is blacklisted or not.
 *
 * @param {Object} playlist the media playlist object
 * @return {boolean} whether the playlist is blacklisted or not
 * @function isBlacklisted
 */
export const isBlacklisted = function(playlist) {
  return playlist.excludeUntil && playlist.excludeUntil > Date.now();
};

/**
 * Check whether the playlist is compatible with current playback configuration or has
 * been blacklisted permanently for being incompatible.
 *
 * @param {Object} playlist the media playlist object
 * @return {boolean} whether the playlist is incompatible or not
 * @function isIncompatible
 */
export const isIncompatible = function(playlist) {
  return playlist.excludeUntil && playlist.excludeUntil === Infinity;
};

/**
 * Check whether the playlist is enabled or not.
 *
 * @param {Object} playlist the media playlist object
 * @return {boolean} whether the playlist is enabled or not
 * @function isEnabled
 */
export const isEnabled = function(playlist) {
  const blacklisted = isBlacklisted(playlist);

  return (!playlist.disabled && !blacklisted);
};

/**
 * Check whether the playlist has been manually disabled through the representations api.
 *
 * @param {Object} playlist the media playlist object
 * @return {boolean} whether the playlist is disabled manually or not
 * @function isDisabled
 */
export const isDisabled = function(playlist) {
  return playlist.disabled;
};

export default {
  isEnabled,
  isDisabled,
  isBlacklisted,
  isIncompatible,
};
