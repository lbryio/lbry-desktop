import {
  ACTIONS as LBRY_REDUX_ACTIONS,
  makeSelectIsFollowingTag,
  selectFollowedTags,
} from 'lbry-redux';
import Lbryio from 'lbryio';
import * as ACTIONS from 'constants/action_types';
import { selectSubscriptions } from 'redux/selectors/subscriptions';

const persistShape = {
  version: '0',
  shared: {},
};

export function userStateSyncMiddleware() {
  return ({ getState }) => next => action => {
    if (
      action.type === ACTIONS.CHANNEL_SUBSCRIBE ||
      action.type === ACTIONS.CHANNEL_UNSUBSCRIBE ||
      action.type === LBRY_REDUX_ACTIONS.TOGGLE_TAG_FOLLOW
    ) {
      const newShape = { ...persistShape };
      const state = getState();
      const subscriptions = selectSubscriptions(state).map(({ uri }) => uri);
      const tags = selectFollowedTags(state);
      newShape.shared.subscriptions = subscriptions;
      newShape.shared.tags = tags;

      const { uri } = action.data;

      if (action.type === ACTIONS.CHANNEL_SUBSCRIBE) {
        const newSubscriptions = subscriptions.slice();
        newSubscriptions.push(uri);
        newShape.shared.subscriptions = newSubscriptions;
      } else if (action.type === ACTIONS.CHANNEL_UNSUBSCRIBE) {
        let newSubscriptions = subscriptions.slice();
        newSubscriptions = newSubscriptions.filter(subscribedUri => subscribedUri !== uri);
        newShape.shared.subscriptions = newSubscriptions;
      } else {
        const toggledTag = action.data.name;
        const followedTags = selectFollowedTags(state).map(({ name }) => name);
        const isFollowing = makeSelectIsFollowingTag(toggledTag)(state);
        let newTags = followedTags.slice();

        if (isFollowing) {
          newTags = newTags.filter(followedTag => followedTag.name !== toggledTag);
        } else {
          newTags.push(toggledTag);
        }

        newShape.shared.tags = newTags;
      }

      Lbryio.call('user_settings', 'set', { settings: newShape });
    }
    return next(action);
  };
}
