// @flow
import { createSelector } from 'reselect';

type State = { tags: TagState };

const selectState = (state: State) => state.tags || {};

export const selectKnownTagsByName = (state: State): KnownTags => selectState(state).knownTags;
export const selectFollowedTagsList = (state: State) => selectState(state).followedTags;

export const selectFollowedTags = createSelector(selectFollowedTagsList, (followedTags: Array<string>): Array<Tag> =>
  followedTags.map((tag) => ({ name: tag.toLowerCase() })).sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnfollowedTags = createSelector(
  selectKnownTagsByName,
  selectFollowedTagsList,
  (tagsByName: KnownTags, followedTags: Array<string>): Array<Tag> => {
    const followedTagsSet = new Set(followedTags);
    let tagsToReturn = [];
    Object.keys(tagsByName).forEach((key) => {
      if (!followedTagsSet.has(key)) {
        const { name } = tagsByName[key];
        tagsToReturn.push({ name: name.toLowerCase() });
      }
    });

    return tagsToReturn;
  }
);

export const makeSelectIsFollowingTag = (tag: string) =>
  createSelector(selectFollowedTags, (followedTags) => {
    return followedTags.some((followedTag) => followedTag.name === tag.toLowerCase());
  });
