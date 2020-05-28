/*
 * How to use this file:
 * Settings exported from here will trigger the setting to be
 * sent to the preference middleware when set using the
 * usual setDaemonSettings and clearDaemonSettings methods.
 *
 * See redux/settings/actions in the app for where this is used.
 */

import * as DAEMON_SETTINGS from './daemon_settings';

export const WALLET_SERVERS = DAEMON_SETTINGS.LBRYUM_SERVERS;
export const SHARE_USAGE_DATA = DAEMON_SETTINGS.SHARE_USAGE_DATA;
