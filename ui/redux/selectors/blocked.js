// @flow
import { createSelector } from 'reselect';
import { splitBySeparator } from 'util/lbryURI';

const selectState = (state: { blocked: BlocklistState }) => state.blocked || {};

export const selectMutedChannels = createSelector(selectState, (state: BlocklistState) => {
  return state.blockedChannels.filter((e) => typeof e === 'string');
});

export const makeSelectChannelIsMuted = (uri: string) =>
  createSelector(selectMutedChannels, (state: Array<string>) => {
    return state.includes(uri);
  });

export const selectMutedAndBlockedChannelIds = createSelector(
  selectState,
  (state) => state.comments,
  (state, commentsState) => {
    const mutedUris = state.blockedChannels;
    const blockedUris = commentsState.moderationBlockList;
    return Array.from(
      new Set((mutedUris || []).concat(blockedUris || []).map((uri) => splitBySeparator(uri)[1]))
    ).sort();
  }
);
