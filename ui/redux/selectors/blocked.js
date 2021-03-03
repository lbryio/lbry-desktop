// @flow
import { createSelector } from 'reselect';

const selectState = (state: { blocked: BlocklistState }) => state.blocked || {};

export const selectMutedChannels = createSelector(selectState, (state: BlocklistState) => {
  return state.blockedChannels.filter((e) => typeof e === 'string');
});

export const makeSelectChannelIsMuted = (uri: string) =>
  createSelector(selectMutedChannels, (state: Array<string>) => {
    return state.includes(uri);
  });
