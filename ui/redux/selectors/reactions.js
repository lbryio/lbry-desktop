import * as REACTION_TYPES from 'constants/reactions';
import { selectClaimForUri } from 'redux/selectors/claims';

const selectState = (state) => state.reactions || {};

export const selectReactionsById = (state) => selectState(state).reactionsById;
export const selectFetchingReactions = (state) => selectState(state).fetchingReactions;

export const selectReactionsForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const reactionsById = selectReactionsById(state);
  return claim ? reactionsById[claim.claim_id] : {};
};

export const selectMyReactionForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const reactions = selectReactionsForUri(state, uri);

  if (!claim || !reactions || !reactions.my_reactions) {
    return undefined;
  }
  const claimId = claim.claim_id;

  const myReactions = reactions.my_reactions[claimId];
  if (myReactions[REACTION_TYPES.LIKE]) {
    return REACTION_TYPES.LIKE;
  } else if (myReactions[REACTION_TYPES.DISLIKE]) {
    return REACTION_TYPES.DISLIKE;
  } else {
    // Ignore other types of reactions for now
    return undefined;
  }
};

export const selectLikeCountForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const reactions = selectReactionsForUri(state, uri);

  if (!claim || !reactions || !reactions.my_reactions || !reactions.others_reactions) {
    return undefined;
  }

  const claimId = claim.claim_id;
  let count = 0;

  if (reactions.others_reactions) {
    const likeCount = reactions.others_reactions[claimId][REACTION_TYPES.LIKE] || 0;
    count += likeCount;
  }
  if (reactions.my_reactions) {
    const likeCount = reactions.my_reactions[claimId][REACTION_TYPES.LIKE] || 0;
    count += likeCount;
  }

  return count;
};

export const selectDislikeCountForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const reactions = selectReactionsForUri(state, uri);

  if (!claim || !reactions || !reactions.my_reactions || !reactions.others_reactions) {
    return undefined;
  }

  const claimId = claim.claim_id;
  let count = 0;

  if (reactions.others_reactions) {
    const dislikeCount = reactions.others_reactions[claimId][REACTION_TYPES.DISLIKE] || 0;
    count += dislikeCount;
  }
  if (reactions.my_reactions) {
    const dislikeCount = reactions.my_reactions[claimId][REACTION_TYPES.DISLIKE] || 0;
    count += dislikeCount;
  }

  return count;
};
