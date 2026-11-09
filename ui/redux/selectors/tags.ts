import {createSelector} from 'reselect';

type State = {
  tags: TagState
};

const selectState = (state: State) => state.tags || {};

export const selectKnownTagsByName = createSelector(selectState, (state: TagState): KnownTags => state.knownTags);

// @ts-expect-error - TS2339 - Property 'followedTags' does not exist on type '{}'.
export const selectFollowedTagsList = (state: State) => selectState(state).followedTags;

export const selectFollowedTags = createSelector(selectFollowedTagsList, (followedTags: Array<string>): Array<Tag> => followedTags.map((tag) => ({ name: tag.toLowerCase() })).sort((a, b) => a.name.localeCompare(b.name))
);

export const selectUnfollowedTags = createSelector(
  selectKnownTagsByName,
  selectFollowedTagsList,
  (tagsByName: KnownTags, followedTags: Array<string>): Array<Tag> => {
    const followedTagsSet = new Set(followedTags);
    let tagsToReturn: unknown = [];
    Object.keys(tagsByName).forEach((key) => {
      if (!followedTagsSet.has(key)) {
        const { name } = tagsByName[key];
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
        tagsToReturn.push({ name: name.toLowerCase() });
      }
    });

// @ts-expect-error - TS2740 - Type '{}' is missing the following properties from type 'Tag[]': length, pop, push, concat, and 28 more.
    return tagsToReturn;
  }
);

export const makeSelectIsFollowingTag = (tag: string) =>
  createSelector(selectFollowedTags, (followedTags) => {
    return followedTags.some((followedTag) => followedTag.name === tag.toLowerCase());
  });
