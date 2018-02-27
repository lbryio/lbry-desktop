import { createSelector } from 'reselect';

const selectState = state => state.publish || {};

export const selectPendingPublishes = createSelector(selectState, state => {
  return state.pendingPublishes.map(pendingClaim => ({ ...pendingClaim, pending: true })) || [];
});

export const selectPublishFormValues = createSelector(selectState, state => {
  const { pendingPublish, ...formValues } = state;
  return formValues;
})
