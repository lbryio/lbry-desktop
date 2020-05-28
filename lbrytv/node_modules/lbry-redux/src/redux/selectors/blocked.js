// @flow
import { createSelector } from 'reselect';

const selectState = (state: { blocked: BlocklistState }) => state.blocked || {};

export const selectBlockedChannels = createSelector(
  selectState,
  (state: BlocklistState) => state.blockedChannels
);

export const selectBlockedChannelsCount = createSelector(
  selectBlockedChannels,
  (state: Array<string>) => state.length
);

export const selectChannelIsBlocked = (uri: string) =>
  createSelector(
    selectBlockedChannels,
    (state: Array<string>) => {
      return state.includes(uri);
    }
  );
