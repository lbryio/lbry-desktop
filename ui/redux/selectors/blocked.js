// @flow
import { createSelector } from 'reselect';

const selectState = (state: { blocked: BlocklistState }) => state.blocked || {};

export const selectBlockedChannels = createSelector(selectState, (state: BlocklistState) => state.blockedChannels);

export const selectBlockedChannelsCount = createSelector(selectBlockedChannels, (state: Array<string>) => state.length);

export const selectBlockedChannelsObj = createSelector(selectState, (state: BlocklistState) => {
  return state.blockedChannels.reduce((acc: any, val: any) => {
    const outpoint = `${val.txid}:${String(val.nout)}`;
    return {
      ...acc,
      [outpoint]: 1,
    };
  }, {});
});

export const selectChannelIsBlocked = (uri: string) =>
  createSelector(selectBlockedChannels, (state: Array<string>) => {
    return state.includes(uri);
  });
