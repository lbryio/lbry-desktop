import { createSelector } from 'reselect';
import { parseURI } from 'lbry-redux';

const selectState = state => state.publish || {};

export const selectPendingPublishes = createSelector(
  selectState,
  state => state.pendingPublishes.map(pendingClaim => ({ ...pendingClaim, pending: true })) || []
);

export const selectPendingPublishesLessEdits = createSelector(
  selectPendingPublishes,
  pendingPublishes => pendingPublishes.filter(pendingPublish => !pendingPublish.isEdit)
);

export const selectPublishFormValues = createSelector(selectState, state => {
  const { pendingPublish, ...formValues } = state;
  return formValues;
});

export const selectPendingPublish = uri =>
  createSelector(selectPendingPublishes, pendingPublishes => {
    const { claimName, contentName } = parseURI(uri);

    if (!pendingPublishes.length) {
      return null;
    }

    return pendingPublishes.filter(
      publish => publish.name === claimName || publish.name === contentName
    )[0];
  });
