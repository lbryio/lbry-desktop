// @flow
import * as ACTIONS from 'constants/action_types';
import { DEFAULT_KNOWN_TAGS, DEFAULT_FOLLOWED_TAGS } from 'constants/tags';
import { handleActions } from 'util/redux-utils';

function getDefaultKnownTags() {
  return DEFAULT_FOLLOWED_TAGS.concat(DEFAULT_KNOWN_TAGS).reduce((tagsMap, tag) => {
    tagsMap[tag] = { name: tag };
    return tagsMap;
  }, {});
}

const defaultState: TagState = {
  followedTags: [],
  knownTags: getDefaultKnownTags(),
};

export default handleActions(
  {
    [ACTIONS.TOGGLE_TAG_FOLLOW]: (state: TagState, action: TagAction): TagState => {
      const { followedTags } = state;
      const { name } = action.data;

      let newFollowedTags = followedTags.slice();

      if (newFollowedTags.includes(name)) {
        newFollowedTags = newFollowedTags.filter((tag) => tag !== name);
      } else {
        newFollowedTags.push(name);
      }

      return {
        ...state,
        followedTags: newFollowedTags,
      };
    },

    [ACTIONS.TAG_ADD]: (state: TagState, action: TagAction) => {
      const { knownTags } = state;
      const { name } = action.data;

      let newKnownTags = { ...knownTags };
      newKnownTags[name] = { name };

      return {
        ...state,
        knownTags: newKnownTags,
      };
    },

    [ACTIONS.TAG_DELETE]: (state: TagState, action: TagAction) => {
      const { knownTags, followedTags } = state;
      const { name } = action.data;

      let newKnownTags = { ...knownTags };
      delete newKnownTags[name];
      const newFollowedTags = followedTags.filter((tag) => tag !== name);

      return {
        ...state,
        knownTags: newKnownTags,
        followedTags: newFollowedTags,
      };
    },
    [ACTIONS.USER_STATE_POPULATE]: (state: TagState, action: { data: { tags: ?Array<string> } }) => {
      const { tags } = action.data;
      if (Array.isArray(tags)) {
        const next = tags && tags.filter((tag) => typeof tag === 'string');
        const prev = state.followedTags;

        if (next && prev && prev.length === next.length && prev.every((value, index) => value === next[index])) {
          // No changes
          return state;
        }

        // New state
        return {
          ...state,
          followedTags: next || [],
        };
      }

      // Purge 'followedTags'
      return {
        ...state,
      };
    },
  },
  defaultState
);
