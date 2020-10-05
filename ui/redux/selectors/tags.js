// @flow
import { createSelector } from 'reselect';

const selectState = (state: { tags: TagState }) => state.tags || {};

export const selectKnownTagsByName = createSelector(selectState, (state: TagState): KnownTags => state.knownTags);

export const selectFollowedTagsList = createSelector(selectState, (state: TagState): Array<string> =>
  state.followedTags.filter(tag => typeof tag === 'string')
);

export const selectFollowedTags = createSelector(selectFollowedTagsList, (followedTags: Array<string>): Array<Tag> =>
  followedTags.map(tag => ({ name: tag.toLowerCase() })).sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnfollowedTags = createSelector(
  selectKnownTagsByName,
  selectFollowedTagsList,
  (tagsByName: KnownTags, followedTags: Array<string>): Array<Tag> => {
    const followedTagsSet = new Set(followedTags);
    let tagsToReturn = [];
    Object.keys(tagsByName).forEach(key => {
      if (!followedTagsSet.has(key)) {
        const { name } = tagsByName[key];
        tagsToReturn.push({ name: name.toLowerCase() });
      }
    });

    return tagsToReturn;
  }
);

export const makeSelectIsFollowingTag = (tag: string) =>
  createSelector(selectFollowedTags, followedTags => {
    return followedTags.some(followedTag => followedTag.name === tag.toLowerCase());
  });
