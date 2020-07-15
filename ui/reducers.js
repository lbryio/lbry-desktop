import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { claimsReducer, fileInfoReducer, searchReducer, walletReducer, tagsReducer, publishReducer } from 'lbry-redux';
import {
  costInfoReducer,
  blacklistReducer,
  filteredReducer,
  homepageReducer,
  statsReducer,
  syncReducer,
  webReducer,
} from 'lbryinc';
import appReducer from 'redux/reducers/app';
import contentReducer from 'redux/reducers/content';
import settingsReducer from 'redux/reducers/settings';
import subscriptionsReducer from 'redux/reducers/subscriptions';
import notificationsReducer from 'redux/reducers/notifications';
import rewardsReducer from 'redux/reducers/rewards';
import userReducer from 'redux/reducers/user';
import commentsReducer from 'redux/reducers/comments';
import blockedReducer from 'redux/reducers/blocked';

export default history =>
  combineReducers({
    router: connectRouter(history),
    app: appReducer,
    blacklist: blacklistReducer,
    filtered: filteredReducer,
    claims: claimsReducer,
    comments: commentsReducer,
    content: contentReducer,
    costInfo: costInfoReducer,
    fileInfo: fileInfoReducer,
    homepage: homepageReducer,
    notifications: notificationsReducer,
    publish: publishReducer,
    rewards: rewardsReducer,
    search: searchReducer,
    settings: settingsReducer,
    stats: statsReducer,
    subscriptions: subscriptionsReducer,
    tags: tagsReducer,
    blocked: blockedReducer,
    user: userReducer,
    wallet: walletReducer,
    sync: syncReducer,
    web: webReducer,
  });
