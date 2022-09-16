import * as ACTIONS from 'constants/action_types';
import { buildTabStateSyncMiddleware } from 'redux/middleware/tab-sync';
import { triggerSharedStateActions } from 'redux/setup/sharedState';

const watchHistoryActions = [
  ACTIONS.SET_CONTENT_POSITION,
  ACTIONS.SET_CONTENT_LAST_VIEWED,
  ACTIONS.CLEAR_CONTENT_HISTORY_URI,
  ACTIONS.CLEAR_CONTENT_HISTORY_ALL,
];

// When syncing actions with multiple states (e.g. STARTED, FAILED, COMPLETED),
// bear in mind that we are actually dispatching actions for other tabs to
// duplicate, so we need to pick the action that makes sense.
const whitelist = [
  ...triggerSharedStateActions,
  ACTIONS.CLIENT_SETTING_CHANGED,
  ACTIONS.NOTIFICATION_DELETE_COMPLETED,
  ACTIONS.USER_LOGGED_IN_BROADCAST,
  ...watchHistoryActions,
];

const tabStateSyncMiddleware = buildTabStateSyncMiddleware(whitelist);

export { tabStateSyncMiddleware };
