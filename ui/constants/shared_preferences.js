/*
 * How to use this file:
 * Settings exported from here will trigger the setting to be
 * sent to the preference middleware when set using the
 * usual setDaemonSettings and clearDaemonSettings methods.
 *
 * See redux/settings/actions in the app for where this is used.
 */

import * as DAEMON_SETTINGS from './daemon_settings';
import * as SETTINGS from './settings';

// DAEMON
export const SDK_SYNC_KEYS = [DAEMON_SETTINGS.LBRYUM_SERVERS, DAEMON_SETTINGS.SHARE_USAGE_DATA];

// CLIENT
export const CLIENT_SYNC_KEYS = [
  SETTINGS.SHOW_MATURE,
  SETTINGS.HIDE_REPOSTS,
  SETTINGS.SHOW_ANONYMOUS,
  SETTINGS.INSTANT_PURCHASE_ENABLED,
  SETTINGS.INSTANT_PURCHASE_MAX,
  SETTINGS.THEME,
  SETTINGS.AUTOPLAY_MEDIA,
  SETTINGS.AUTOPLAY_NEXT,
  SETTINGS.HIDE_BALANCE,
  SETTINGS.HIDE_SPLASH_ANIMATION,
  SETTINGS.FLOATING_PLAYER,
  SETTINGS.DARK_MODE_TIMES,
  SETTINGS.AUTOMATIC_DARK_MODE_ENABLED,
];
