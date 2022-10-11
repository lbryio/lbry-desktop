// @flow
import * as ACTIONS from 'constants/action_types';

const reducers = {};

type MembershipsState = {
  membershipMineByCreatorId: ?MembershipMineDataByCreatorId,
  membershipMineFetching: boolean,
  membershipListByCreatorId: { [creatorId: string]: MembershipTiers },
  membershipListFetchingIds: ClaimIds,
  channelMembershipsByCreatorId: ChannelMembershipsByCreatorId,
  fetchingIdsByCreatorId: { [creatorId: string]: ClaimIds },
  pendingBuyIds: ClaimIds,
  pendingCancelIds: ClaimIds,
  myMembershipTiers: ?MembershipTiers,
  pendingDeleteIds: Array<string>,
  protectedContentClaimsByCreatorId: { [channelId: string]: any },
  mySupportersList: ?SupportersList,
  membershipOdyseePerks: Array<MembershipOdyseePerk>,
  listingAllMyTiers: ?boolean,
  claimMembershipTiersFetchingIds: Array<string>,
};

const defaultState: MembershipsState = {
  membershipMineByCreatorId: undefined,
  membershipMineFetching: false,
  membershipListByCreatorId: {},
  membershipListFetchingIds: [],
  channelMembershipsByCreatorId: {},
  fetchingIdsByCreatorId: {},
  pendingBuyIds: [],
  pendingCancelIds: [],
  myMembershipTiers: undefined,
  pendingDeleteIds: [],
  protectedContentClaimsByCreatorId: {},
  mySupportersList: undefined,
  membershipOdyseePerks: [],
  listingAllMyTiers: undefined,
  claimMembershipTiersFetchingIds: [],
};

reducers[ACTIONS.CHANNEL_MEMBERSHIP_CHECK_STARTED] = (state, action) => {
  const { channel, ids } = action.data;
  const { fetchingIdsByCreatorId: currentFetching } = state;

  return { ...state, fetchingIdsByCreatorId: { ...currentFetching, [channel]: ids } };
};
reducers[ACTIONS.CHANNEL_MEMBERSHIP_CHECK_COMPLETED] = (state, action) => {
  const { channelId, membershipsById } = action.data;

  const currentFetched = Object.assign({}, state.channelMembershipsByCreatorId);
  const newFetched = currentFetched[channelId] ? { ...currentFetched[channelId], ...membershipsById } : membershipsById;
  const newFetchingIdsByCreatorId = Object.assign({}, state.fetchingIdsByCreatorId);
  delete newFetchingIdsByCreatorId[channelId];

  return {
    ...state,
    fetchingIdsByCreatorId: newFetchingIdsByCreatorId,
    channelMembershipsByCreatorId: { ...currentFetched, [channelId]: newFetched },
  };
};
reducers[ACTIONS.CHANNEL_MEMBERSHIP_CHECK_FAILED] = (state, action) => {
  const { channelId } = action.data;

  const currentFetched = Object.assign({}, state.channelMembershipsByCreatorId);
  const newFetchingIdsByCreatorId = Object.assign({}, state.fetchingIdsByCreatorId);
  delete newFetchingIdsByCreatorId[channelId];

  return {
    ...state,
    fetchingIdsByCreatorId: newFetchingIdsByCreatorId,
    channelMembershipsByCreatorId: { ...currentFetched, [channelId]: null },
  };
};

reducers[ACTIONS.SET_MEMBERSHIP_BUY_STARTED] = (state, action) => {
  const newPendingBuyIds = new Set(state.pendingBuyIds);
  newPendingBuyIds.add(action.data);
  return { ...state, pendingBuyIds: Array.from(newPendingBuyIds) };
};
reducers[ACTIONS.SET_MEMBERSHIP_BUY_SUCCESFUL] = (state, action) => {
  const newPendingBuyIds = new Set(state.pendingBuyIds);
  newPendingBuyIds.delete(action.data);
  return { ...state, pendingBuyIds: Array.from(newPendingBuyIds) };
};
reducers[ACTIONS.SET_MEMBERSHIP_BUY_FAILED] = (state, action) => {
  const newPendingBuyIds = new Set(state.pendingBuyIds);
  newPendingBuyIds.delete(action.data);
  return { ...state, pendingBuyIds: Array.from(newPendingBuyIds) };
};

reducers[ACTIONS.SET_MEMBERSHIP_CANCEL_STARTED] = (state, action) => {
  const newPendingCancelIds = new Set(state.pendingCancelIds);
  newPendingCancelIds.add(action.data);
  return { ...state, pendingCancelIds: Array.from(newPendingCancelIds) };
};
reducers[ACTIONS.SET_MEMBERSHIP_CANCEL_SUCCESFUL] = (state, action) => {
  const newPendingCancelIds = new Set(state.pendingCancelIds);
  newPendingCancelIds.delete(action.data);
  return { ...state, pendingCancelIds: Array.from(newPendingCancelIds) };
};
reducers[ACTIONS.SET_MEMBERSHIP_CANCEL_FAILED] = (state, action) => {
  const newPendingCancelIds = new Set(state.pendingCancelIds);
  newPendingCancelIds.delete(action.data);
  return { ...state, pendingCancelIds: Array.from(newPendingCancelIds) };
};

reducers[ACTIONS.DELETE_MEMBERSHIP_STARTED] = (state, action) => {
  const newPendingDeleteIds = new Set(state.pendingDeleteIds);
  newPendingDeleteIds.add(action.data);
  return { ...state, pendingDeleteIds: Array.from(newPendingDeleteIds) };
};
reducers[ACTIONS.DELETE_MEMBERSHIP_SUCCESFUL] = (state, action) => {
  const newPendingDeleteIds = new Set(state.pendingDeleteIds);
  newPendingDeleteIds.delete(action.data);
  return { ...state, pendingDeleteIds: Array.from(newPendingDeleteIds) };
};
reducers[ACTIONS.DELETE_MEMBERSHIP_FAILED] = (state, action) => {
  const newPendingDeleteIds = new Set(state.pendingDeleteIds);
  newPendingDeleteIds.delete(action.data);
  return { ...state, pendingDeleteIds: Array.from(newPendingDeleteIds) };
};

reducers[ACTIONS.GET_MEMBERSHIP_MINE_START] = (state, action) => ({ ...state, membershipMineFetching: true });
reducers[ACTIONS.GET_MEMBERSHIP_MINE_DATA_SUCCESS] = (state, action) => {
  const myPurchasedMembershipTiers: MembershipTiers = action.data;

  const newMembershipMineByCreatorId = {};

  for (const membership of myPurchasedMembershipTiers) {
    const creatorClaimId = membership.MembershipDetails.channel_id;

    const currentMemberships = newMembershipMineByCreatorId[creatorClaimId] || [];
    newMembershipMineByCreatorId[creatorClaimId] = [...currentMemberships, membership];
  }

  return { ...state, membershipMineByCreatorId: newMembershipMineByCreatorId, membershipMineFetching: false };
};
reducers[ACTIONS.GET_MEMBERSHIP_MINE_DATA_FAIL] = (state, action) => ({
  ...state,
  membershipMineByCreatorId: {},
  membershipMineFetching: false,
});

reducers[ACTIONS.MEMBERSHIP_LIST_START] = (state, action) => {
  const channelId = action.data;

  const newMembershipListFetchingIds = new Set(state.membershipListFetchingIds);
  newMembershipListFetchingIds.add(channelId);

  return { ...state, membershipListFetchingIds: Array.from(newMembershipListFetchingIds) };
};
reducers[ACTIONS.MEMBERSHIP_LIST_COMPLETE] = (state, action) => {
  const { channelId, list } = action.data;

  const newMembershipListFetchingIds = new Set(state.membershipListFetchingIds);
  newMembershipListFetchingIds.delete(channelId);
  const newMembershipListById = Object.assign({}, state.membershipListByCreatorId);
  newMembershipListById[channelId] = list;

  return {
    ...state,
    membershipListFetchingIds: Array.from(newMembershipListFetchingIds),
    membershipListByCreatorId: newMembershipListById,
  };
};

reducers[ACTIONS.MEMBERSHIP_PERK_LIST_COMPLETE] = (state, action) => ({ ...state, membershipOdyseePerks: action.data });

reducers[ACTIONS.GET_CLAIM_MEMBERSHIP_TIERS_START] = (state, action) => {
  const claimIds = action.data;

  const newClaimMembershipTiersFetchingIds = [...state.claimMembershipTiersFetchingIds, ...claimIds];

  return { ...state, claimMembershipTiersFetchingIds: newClaimMembershipTiersFetchingIds };
};
reducers[ACTIONS.GET_CLAIM_MEMBERSHIP_TIERS_SUCCESS] = (state, action) => {
  const response: MembershipContentResponse = action.data;

  const newProtectedContentClaims = Object.assign({}, state.protectedContentClaimsByCreatorId);
  const newClaimMembershipTiersFetchingIds = new Set(state.claimMembershipTiersFetchingIds);

  if (response && response.length > 0) {
    response.forEach((membershipContent: MembershipContentResponseItem) => {
      const { channel_id: creatorId, claim_id: claimId, membership_id: membershipId } = membershipContent;

      newClaimMembershipTiersFetchingIds.delete(claimId);

      const creatorContentMemberships = newProtectedContentClaims[creatorId];
      const newCreatorContentMemberships = Object.assign({}, creatorContentMemberships);

      if (!creatorContentMemberships) {
        Object.assign(newProtectedContentClaims, { [creatorId]: newCreatorContentMemberships });
      }

      const contentClaimMemberships = newProtectedContentClaims[creatorId][claimId];
      const newContentClaimMemberships = Object.assign({}, contentClaimMemberships);

      if (!contentClaimMemberships) {
        Object.assign(newProtectedContentClaims[creatorId], { [claimId]: newContentClaimMemberships });
      }

      const contentClaimMembershipIds = new Set(newContentClaimMemberships.memberships);
      contentClaimMembershipIds.add(membershipId);

      Object.assign(newProtectedContentClaims[creatorId][claimId], {
        memberships: Array.from(contentClaimMembershipIds),
      });
    });
  }

  return {
    ...state,
    protectedContentClaimsByCreatorId: newProtectedContentClaims,
    claimMembershipTiersFetchingIds: Array.from(newClaimMembershipTiersFetchingIds),
  };
};
reducers[ACTIONS.GET_CLAIM_MEMBERSHIP_TIERS_FAIL] = (state, action) => {
  const claimIds = new Set(action.data);

  const newClaimMembershipTiersFetchingIds = state.claimMembershipTiersFetchingIds.filter(
    (fetchingId) => !claimIds.has(fetchingId)
  );

  return { ...state, claimMembershipTiersFetchingIds: newClaimMembershipTiersFetchingIds };
};

reducers[ACTIONS.GET_MEMBERSHIP_TIERS_FOR_CHANNEL_SUCCESS] = (state, action) => {
  const newProtectedContentClaims = Object.assign({}, state.protectedContentClaimsByCreatorId);

  let wholeObject = {};
  let channelId;

  if (action.data && action.data.length) {
    channelId = action.data[0].channel_id;

    for (const memberContent of action.data) {
      // doing this conditional because sometimes the backend data is not right
      if (memberContent.claim_id && memberContent.channel_id) {
        if (!wholeObject[memberContent.claim_id]) {
          wholeObject[memberContent.claim_id] = {
            memberships: [],
          };
        }

        const membershipIds = wholeObject[memberContent.claim_id].memberships;

        if (!membershipIds.includes(memberContent.membership_id)) {
          membershipIds.push(memberContent.membership_id);
        }
      }
    }
  }

  if (channelId) {
    newProtectedContentClaims[channelId] = wholeObject;
  }

  return { ...state, protectedContentClaimsByCreatorId: newProtectedContentClaims };
};

reducers[ACTIONS.GET_MEMBERSHIP_SUPPORTERS_LIST_COMPLETE] = (state, action) => {
  const mySupportersList = action.data;
  return { ...state, mySupportersList };
};

reducers[ACTIONS.LIST_ALL_MY_MEMBERSHIPS_START] = (state, action) => ({ ...state, listingAllMyTiers: true });
reducers[ACTIONS.LIST_ALL_MY_MEMBERSHIPS_COMPLETE] = (state, action) => ({ ...state, listingAllMyTiers: false });

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

export default function membershipsReducer(state: MembershipsState = defaultState, action: any) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
