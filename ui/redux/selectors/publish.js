import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { parseURI, buildURI } from 'util/lbryURI';
import {
  selectClaimsById,
  selectMyClaimsWithoutChannels,
  selectResolvingUris,
  selectClaimsByUri,
} from 'redux/selectors/claims';
import { SCHEDULED_LIVESTREAM_TAG } from 'constants/tags';

const selectState = (state) => state.publish || {};

export const selectIsStillEditing = createSelector(selectState, (publishState) => {
  const { editingURI, uri } = publishState;

  if (!editingURI || !uri) {
    return false;
  }

  const { isChannel: currentIsChannel, streamName: currentClaimName, channelName: currentContentName } = parseURI(uri);
  const { isChannel: editIsChannel, streamName: editClaimName, channelName: editContentName } = parseURI(editingURI);

  // Depending on the previous/current use of a channel, we need to compare different things
  // ex: going from a channel to anonymous, the new uri won't return contentName, so we need to use claimName
  const currentName = currentIsChannel ? currentContentName : currentClaimName;
  const editName = editIsChannel ? editContentName : editClaimName;
  return currentName === editName;
});

export const selectPublishFormValues = createSelector(
  selectState,
  (state) => state.settings,
  selectIsStillEditing,
  (publishState, settingsState, isStillEditing) => {
    const { languages, ...formValues } = publishState;
    const language = languages && languages.length && languages[0];
    const { clientSettings } = settingsState;
    const { language: languageSet } = clientSettings;

    let actualLanguage;
    // Sets default if editing a claim with a set language
    if (!language && isStillEditing && languageSet) {
      actualLanguage = languageSet;
    } else {
      actualLanguage = language || languageSet || 'en';
    }

    return { ...formValues, language: actualLanguage };
  }
);

export const makeSelectPublishFormValue = (item) => createSelector(selectState, (state) => state[item]);

export const selectMyClaimForUri = createCachedSelector(
  selectPublishFormValues,
  selectIsStillEditing,
  selectClaimsById,
  selectMyClaimsWithoutChannels,
  (state, caseSensitive) => caseSensitive,
  ({ editingURI, uri }, isStillEditing, claimsById, myClaims, caseSensitive = true) => {
    let { channelName: contentName, streamName: claimName } = parseURI(uri);
    const { streamClaimId: editClaimId } = parseURI(editingURI);

    // If isStillEditing
    // They clicked "edit" from the file page
    // They haven't changed the channel/name after clicking edit
    // Get the claim so they can edit without re-uploading a new file
    if (isStillEditing) {
      return claimsById[editClaimId];
    } else {
      if (caseSensitive) {
        return myClaims.find((claim) =>
          !contentName ? claim.name === claimName : claim.name === contentName || claim.name === claimName
        );
      } else {
        contentName = contentName ? contentName.toLowerCase() : contentName;
        claimName = claimName ? claimName.toLowerCase() : claimName;

        return myClaims.find((claim) => {
          const n = claim && claim.name ? claim.name.toLowerCase() : null;
          return !contentName ? n === claimName : n === contentName || n === claimName;
        });
      }
    }
  }
)((state, caseSensitive = true) => `selectMyClaimForUri-${caseSensitive ? '1' : '0'}`);

export const selectIsResolvingPublishUris = createSelector(
  selectState,
  selectResolvingUris,
  ({ uri, name }, resolvingUris) => {
    if (uri) {
      const isResolvingUri = resolvingUris.includes(uri);
      const { isChannel } = parseURI(uri);

      let isResolvingShortUri;
      if (isChannel && name) {
        const shortUri = buildURI({ streamName: name });
        isResolvingShortUri = resolvingUris.includes(shortUri);
      }

      return isResolvingUri || isResolvingShortUri;
    }

    return false;
  }
);

export const selectTakeOverAmount = createSelector(
  selectState,
  selectMyClaimForUri,
  selectClaimsByUri,
  ({ name }, myClaimForUri, claimsByUri) => {
    if (!name) {
      return null;
    }

    // We only care about the winning claim for the short uri
    const shortUri = buildURI({ streamName: name });
    const claimForShortUri = claimsByUri[shortUri];

    if (!myClaimForUri && claimForShortUri) {
      return claimForShortUri.meta.effective_amount;
    } else if (myClaimForUri && claimForShortUri) {
      // https://github.com/lbryio/lbry/issues/1476
      // We should check the current effective_amount on my claim to see how much additional lbc
      // is needed to win the claim. Currently this is not possible during a takeover.
      // With this, we could say something like, "You have x lbc in support, if you bid y additional LBC you will control the claim"
      // For now just ignore supports. We will just show the winning claim's bid amount
      return claimForShortUri.meta.effective_amount || claimForShortUri.amount;
    }

    return null;
  }
);

export const selectCurrentUploads = (state) => selectState(state).currentUploads;

export const selectUploadCount = createSelector(
  selectCurrentUploads,
  (currentUploads) => currentUploads && Object.keys(currentUploads).length
);

export const selectIsScheduled = (state) => selectState(state).tags.some((t) => t.name === SCHEDULED_LIVESTREAM_TAG);
