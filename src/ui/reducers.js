import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  claimsReducer,
  fileInfoReducer,
  searchReducer,
  walletReducer,
  notificationsReducer,
  tagsReducerBuilder,
} from 'lbry-redux';
import { userReducer, rewardsReducer, costInfoReducer, blacklistReducer, homepageReducer, statsReducer } from 'lbryinc';
import appReducer from 'redux/reducers/app';
import availabilityReducer from 'redux/reducers/availability';
import contentReducer from 'redux/reducers/content';
import settingsReducer from 'redux/reducers/settings';
import subscriptionsReducer from 'redux/reducers/subscriptions';
import publishReducer from 'redux/reducers/publish';
import { defaultKnownTags, defaultFollowedTags } from 'constants/tags';

function getDefaultKnownTags() {
  return defaultFollowedTags.concat(defaultKnownTags).reduce(
    (tagsMap, tag) => ({
      ...tagsMap,
      [tag]: { name: tag },
    }),
    {}
  );
}

export default history =>
  combineReducers({
    router: connectRouter(history),
    app: appReducer,
    availability: availabilityReducer,
    blacklist: blacklistReducer,
    claims: claimsReducer,
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
    tags: tagsReducerBuilder({ followedTags: defaultFollowedTags, knownTags: getDefaultKnownTags() }),
    user: userReducer,
    wallet: walletReducer,
  });
