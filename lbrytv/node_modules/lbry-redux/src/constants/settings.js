/* hardcoded names still exist for these in reducers/settings.js - only discovered when debugging */
/* Many SETTINGS are stored in the localStorage by their name -
    be careful about changing the value of a SETTINGS constant, as doing so can invalidate existing SETTINGS */

export const SHOW_NSFW = 'showNsfw';
export const CREDIT_REQUIRED_ACKNOWLEDGED = 'credit_required_acknowledged';
export const NEW_USER_ACKNOWLEDGED = 'welcome_acknowledged';
export const EMAIL_COLLECTION_ACKNOWLEDGED = 'email_collection_acknowledged';
export const INVITE_ACKNOWLEDGED = 'invite_acknowledged';
export const LANGUAGE = 'language';
export const SHOW_MATURE = 'show_mature';
export const HIDE_REPOSTS = 'hide_reposts';
export const SHOW_ANONYMOUS = 'show_anonymous';
export const SHOW_UNAVAILABLE = 'show_unavailable';
export const INSTANT_PURCHASE_ENABLED = 'instant_purchase_enabled';
export const INSTANT_PURCHASE_MAX = 'instant_purchase_max';
export const THEME = 'theme';
export const THEMES = 'themes';
export const AUTOMATIC_DARK_MODE_ENABLED = 'automatic_dark_mode_enabled';
export const AUTOPLAY = 'autoplay';
export const OS_NOTIFICATIONS_ENABLED = 'os_notifications_enabled';
export const AUTO_DOWNLOAD = 'auto_download';
export const AUTO_LAUNCH = 'auto_launch';
export const SUPPORT_OPTION = 'support_option';
export const HIDE_BALANCE = 'hide_balance';
export const HIDE_SPLASH_ANIMATION = 'hide_splash_animation';
export const FLOATING_PLAYER = 'floating_player';
export const DARK_MODE_TIMES = 'dark_mode_times';
export const ENABLE_SYNC = 'enable_sync';

// mobile settings
export const BACKGROUND_PLAY_ENABLED = 'backgroundPlayEnabled';
export const FOREGROUND_NOTIFICATION_ENABLED = 'foregroundNotificationEnabled';
export const KEEP_DAEMON_RUNNING = 'keepDaemonRunning';
export const SHOW_URI_BAR_SUGGESTIONS = 'showUriBarSuggestions';
export const RECEIVE_SUBSCRIPTION_NOTIFICATIONS = 'receiveSubscriptionNotifications';
export const RECEIVE_REWARD_NOTIFICATIONS = 'receiveRewardNotifications';
export const RECEIVE_INTERESTS_NOTIFICATIONS = 'receiveInterestsNotifications';
export const RECEIVE_CREATOR_NOTIFICATIONS = 'receiveCreatorNotifications';
