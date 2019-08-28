import { createSelector } from 'reselect';
import { parseURI, selectClaimsById, selectMyClaimsWithoutChannels, selectResolvingUris, buildURI } from 'lbry-redux';

const selectState = state => state.publish || {};

export const selectPublishFormValues = createSelector(
  selectState,
  state => {
    const { pendingPublish, ...formValues } = state;
    return formValues;
  }
);

export const makeSelectPublishFormValue = item =>
  createSelector(
    selectState,
    state => state[item]
  );

// Is the current uri the same as the uri they clicked "edit" on
export const selectIsStillEditing = createSelector(
  selectPublishFormValues,
  publishState => {
    const { editingURI, uri } = publishState;

    if (!editingURI || !uri) {
      return false;
    }

    const { isChannel: currentIsChannel, claimName: currentClaimName, contentName: currentContentName } = parseURI(uri);
    const { isChannel: editIsChannel, claimName: editClaimName, contentName: editContentName } = parseURI(editingURI);

    // Depending on the previous/current use of a channel, we need to compare different things
    // ex: going from a channel to anonymous, the new uri won't return contentName, so we need to use claimName
    const currentName = currentIsChannel ? currentContentName : currentClaimName;
    const editName = editIsChannel ? editContentName : editClaimName;
    return currentName === editName;
  }
);

export const selectMyClaimForUri = createSelector(
  selectPublishFormValues,
  selectIsStillEditing,
  selectClaimsById,
  selectMyClaimsWithoutChannels,
  ({ editingURI, uri }, isStillEditing, claimsById, myClaims) => {
    const { contentName, claimName } = parseURI(uri);
    const { claimId: editClaimId } = parseURI(editingURI);

    // If isStillEditing
    // They clicked "edit" from the file page
    // They haven't changed the channel/name after clicking edit
    // Get the claim so they can edit without re-uploading a new file
    return isStillEditing
      ? claimsById[editClaimId]
      : myClaims.find(claim =>
          !contentName ? claim.name === claimName : claim.name === contentName || claim.name === claimName
        );
  }
);

export const selectIsResolvingPublishUris = createSelector(
  selectState,
  selectResolvingUris,
  ({ uri, name }, resolvingUris) => {
    if (uri) {
      const isResolvingUri = resolvingUris.includes(uri);
      const { isChannel } = parseURI(uri);

      let isResolvingShortUri;
      if (isChannel) {
        const shortUri = buildURI({ contentName: name });
        isResolvingShortUri = resolvingUris.includes(shortUri);
      }

      return isResolvingUri || isResolvingShortUri;
    }

    return false;
  }
);
