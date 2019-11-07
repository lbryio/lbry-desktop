import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  claimsReducer,
  fileInfoReducer,
  searchReducer,
  walletReducer,
  notificationsReducer,
  tagsReducer,
  commentReducer,
  blockedReducer,
  publishReducer,
  fileReducer,
} from 'lbry-redux';
import {
  userReducer,
  rewardsReducer,
  costInfoReducer,
  blacklistReducer,
  filteredReducer,
  homepageReducer,
  statsReducer,
  syncReducer,
  lbrytvReducer,
} from 'lbryinc';
import appReducer from 'redux/reducers/app';
import availabilityReducer from 'redux/reducers/availability';
import contentReducer from 'redux/reducers/content';
import settingsReducer from 'redux/reducers/settings';
import subscriptionsReducer from 'redux/reducers/subscriptions';

export default history =>
  combineReducers({
    router: connectRouter(history),
    app: appReducer,
    availability: availabilityReducer,
    blacklist: blacklistReducer,
    filtered: filteredReducer,
    claims: claimsReducer,
    comments: commentReducer,
    content: contentReducer,
    costInfo: costInfoReducer,
    fileInfo: fileInfoReducer,
    file: fileReducer,
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
    lbrytv: lbrytvReducer,
  });
