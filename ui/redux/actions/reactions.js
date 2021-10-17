// @flow
import { Lbryio } from 'lbryinc';
import * as ACTIONS from 'constants/action_types';
import * as REACTION_TYPES from 'constants/reactions';
import { makeSelectMyReactionForUri } from 'redux/selectors/reactions';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

export const doFetchReactions = (claimId: string) => (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.REACTIONS_LIST_STARTED });

  return Lbryio.call('reaction', 'list', { claim_ids: claimId }, 'post')
    .then((reactions: Array<number>) => {
      dispatch({ type: ACTIONS.REACTIONS_LIST_COMPLETED, data: { claimId, reactions } });
    })
    .catch((error) => {
      dispatch({ type: ACTIONS.REACTIONS_LIST_FAILED, data: error });
    });
};

export const doReactionLike = (uri: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const myReaction = makeSelectMyReactionForUri(uri)(state);
  const claim = makeSelectClaimForUri(uri)(state);
  const claimId = claim.claim_id;
  const shouldRemove = myReaction === REACTION_TYPES.LIKE;

  return Lbryio.call(
    'reaction',
    'react',
    {
      claim_ids: claimId,
      type: REACTION_TYPES.LIKE,
      clear_types: REACTION_TYPES.DISLIKE,
      ...(shouldRemove ? { remove: true } : {}),
    },
    'post'
  )
    .then(() => {
      dispatch({ type: ACTIONS.REACTIONS_LIKE_COMPLETED, data: { claimId, shouldRemove } });
    })
    .catch((error) => {
      dispatch({ type: ACTIONS.REACTIONS_NEW_FAILED, data: error });
    });
};

export const doReactionDislike = (uri: string) => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const myReaction = makeSelectMyReactionForUri(uri)(state);
  const claim = makeSelectClaimForUri(uri)(state);
  const claimId = claim.claim_id;
  const shouldRemove = myReaction === REACTION_TYPES.DISLIKE;

  return Lbryio.call(
    'reaction',
    'react',
    {
      claim_ids: claimId,
      type: REACTION_TYPES.DISLIKE,
      clear_types: REACTION_TYPES.LIKE,
      ...(shouldRemove ? { remove: true } : {}),
    },
    'post'
  )
    .then(() => {
      dispatch({ type: ACTIONS.REACTIONS_DISLIKE_COMPLETED, data: { claimId, shouldRemove } });
    })
    .catch((error) => {
      dispatch({ type: ACTIONS.REACTIONS_NEW_FAILED, data: error });
    });
};
