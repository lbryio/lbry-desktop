import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { costInfoReducer, blacklistReducer, filteredReducer, statsReducer } from 'lbryinc';
import { claimsReducer } from 'redux/reducers/claims';
import { fileInfoReducer } from 'redux/reducers/file_info';
import { walletReducer } from 'redux/reducers/wallet';
import { publishReducer } from 'redux/reducers/publish';
import { collectionsReducer } from 'redux/reducers/collections';
import appReducer from 'redux/reducers/app';
import tagsReducer from 'redux/reducers/tags';
import contentReducer from 'redux/reducers/content';
import settingsReducer from 'redux/reducers/settings';
import subscriptionsReducer from 'redux/reducers/subscriptions';
import notificationsReducer from 'redux/reducers/notifications';
import rewardsReducer from 'redux/reducers/rewards';
import userReducer from 'redux/reducers/user';
import commentsReducer from 'redux/reducers/comments';
import blockedReducer from 'redux/reducers/blocked';
import coinSwapReducer from 'redux/reducers/coinSwap';
import livestreamReducer from 'redux/reducers/livestream';
import searchReducer from 'redux/reducers/search';
import reactionsReducer from 'redux/reducers/reactions';
import syncReducer from 'redux/reducers/sync';
import reportContentReducer from 'redux/reducers/reportContent';

export default (history) =>
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
    livestream: livestreamReducer,
    notifications: notificationsReducer,
    publish: publishReducer,
    reactions: reactionsReducer,
    reportContent: reportContentReducer,
    rewards: rewardsReducer,
    search: searchReducer,
    settings: settingsReducer,
    stats: statsReducer,
    subscriptions: subscriptionsReducer,
    tags: tagsReducer,
    blocked: blockedReducer,
    coinSwap: coinSwapReducer,
    user: userReducer,
    wallet: walletReducer,
    sync: syncReducer,
    collections: collectionsReducer,
  });
