// @flow
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';

import { getTotalPriceFromSupportersList } from 'util/memberships';

import {
  selectChannelClaimIdForUri,
  selectMyChannelClaimIds,
  selectNameForClaimId,
  selectProtectedContentTagForUri,
  selectClaimForId,
  selectClaimIsMineForId,
} from 'redux/selectors/claims';
import { getChannelIdFromClaim } from 'util/claim';
import { ODYSEE_CHANNEL } from 'constants/channels';
import * as MEMBERSHIP_CONSTS from 'constants/memberships';

type State = { claims: any, user: any, memberships: any };

const selectState = (state: State) => state.memberships || {};

export const selectMembershipMineData = (state: State) => selectState(state).membershipMineByCreatorId;
export const selectMembershipMineFetching = (state: State) => selectState(state).membershipMineFetching;
export const selectMembershipMineFetched = (state: State) => selectMembershipMineData(state) !== undefined;

export const selectMembershipFetchingIdsByChannel = (state: State) => selectState(state).fetchingIdsByCreatorId;
export const selectChannelMembershipsByCreatorId = (state: State) => selectState(state).channelMembershipsByCreatorId;
export const selectChannelMembershipsForCreatorId = (state: State, channelId: string) =>
  selectChannelMembershipsByCreatorId(state)[channelId];

export const selectPendingBuyMembershipIds = (state: State) => selectState(state).pendingBuyIds;
export const selectPurchaseIsPendingForMembershipId = (state: State, id: string) =>
  new Set(selectPendingBuyMembershipIds(state)).has(id);

export const selectPendingCancelMembershipIds = (state: State) => selectState(state).pendingCancelIds;
export const selectCancelIsPendingForMembershipId = (state: State, id: string) =>
  new Set(selectPendingCancelMembershipIds(state)).has(id);

export const selectMembershipListFetchingIds = (state: State) => selectState(state).membershipListFetchingIds;
export const selectIsMembershipListFetchingForId = (state: State, claimId: ClaimId) =>
  new Set(selectMembershipListFetchingIds(state)).has(claimId);
export const selectMembershipsListByCreatorId = (state: State) => selectState(state).membershipListByCreatorId;
export const selectMembershipTiersForCreatorId = (state: State, creatorId: ClaimId) =>
  selectMembershipsListByCreatorId(state)[creatorId];

export const selectClaimMembershipTiersFetchingIds = (state: State) =>
  selectState(state).claimMembershipTiersFetchingIds;
export const selectIsClaimMembershipTierFetchingForId = (state: State, claimId: string) =>
  new Set(selectClaimMembershipTiersFetchingIds(state)).has(claimId);
export const selectProtectedContentClaimsById = (state: State) => selectState(state).protectedContentClaimsByCreatorId;
export const selectProtectedContentClaimsForId = (state: State, channelId: string) =>
  selectProtectedContentClaimsById(state)[channelId];

export const selectMySupportersList = (state: State) => selectState(state).mySupportersList;
export const selectMyTotalSupportersAmount = (state: State) => selectMySupportersList(state)?.length || 0;

export const selectIsListingAllMyTiers = (state: State) => selectState(state).listingAllMyTiers;

export const selectMembershipOdyseePerks = (state: State) => selectState(state).membershipOdyseePerks;
export const selectMembershipOdyseePermanentPerks = createSelector(
  selectMembershipOdyseePerks,
  (membershipOdyseePerks) =>
    membershipOdyseePerks.filter((perk) => MEMBERSHIP_CONSTS.PERMANENT_TIER_PERKS.includes(perk.id))
);

export const selectMyTotalMonthlyIncome = createSelector(
  selectMySupportersList,
  (supportersList) => supportersList && getTotalPriceFromSupportersList(supportersList)
);

export const selectSupportersForChannelId = createSelector(
  selectNameForClaimId,
  selectMySupportersList,
  (channelName, supportersList) =>
    supportersList && supportersList.filter((supporter) => supporter.ChannelBeingSupported === channelName)
);

export const selectSupportersAmountForChannelId = (state: State, channelId: ClaimId) =>
  selectSupportersForChannelId(state, channelId)?.length || 0;

export const selectMonthlyIncomeForChannelId = createSelector(
  selectSupportersForChannelId,
  (channelSupporters) => channelSupporters && getTotalPriceFromSupportersList(channelSupporters)
);

// -- Active Membership = auto_renew is enabled
export const selectMyActiveMembershipsById = createSelector(selectMembershipMineData, (myMembershipsByCreatorId) => {
  if (!myMembershipsByCreatorId) return myMembershipsByCreatorId;

  const activeMembershipsById = {};

  for (const creatorChannelId in myMembershipsByCreatorId) {
    const purchasedCreatorMemberships = myMembershipsByCreatorId[creatorChannelId];

    for (const membership of purchasedCreatorMemberships) {
      if (membership.Membership.auto_renew) {
        activeMembershipsById[creatorChannelId] = new Set(activeMembershipsById[creatorChannelId]);
        activeMembershipsById[creatorChannelId].add(membership);
        // $FlowFixMe
        activeMembershipsById[creatorChannelId] = Array.from(activeMembershipsById[creatorChannelId]);
      }
    }
  }

  return activeMembershipsById;
});

// -- Valid Membership = still in period_end date range
export const selectMyValidMembershipsById = createSelector(selectMembershipMineData, (myMembershipsByCreatorId) => {
  if (!myMembershipsByCreatorId) return myMembershipsByCreatorId;

  const validMembershipsById = {};

  for (const creatorChannelId in myMembershipsByCreatorId) {
    const purchasedCreatorMemberships = myMembershipsByCreatorId[creatorChannelId];

    for (const membership of purchasedCreatorMemberships) {
      if (membership.Subscription.current_period_end * 1000 > Date.now()) {
        validMembershipsById[creatorChannelId] = new Set(validMembershipsById[creatorChannelId]);
        validMembershipsById[creatorChannelId].add(membership);
        // $FlowFixMe
        validMembershipsById[creatorChannelId] = Array.from(validMembershipsById[creatorChannelId]);
      }
    }
  }

  return validMembershipsById;
});

// -- From Creators = Removes Odysee memberships
export const selectMyPurchasedMembershipsFromCreatorsById = (state: State) => {
  const purchasedMembershipsById = selectMembershipMineData(state);
  if (!purchasedMembershipsById) return purchasedMembershipsById;

  const purchasedMembershipsFromCreatorsById = Object.assign({}, purchasedMembershipsById);
  delete purchasedMembershipsFromCreatorsById[ODYSEE_CHANNEL.ID];

  return purchasedMembershipsFromCreatorsById;
};
export const selectMyPurchasedMembershipsFromCreators = createSelector(
  selectMyPurchasedMembershipsFromCreatorsById,
  (myPurchasedCreatorMemberships) => myPurchasedCreatorMemberships && Object.values(myPurchasedCreatorMemberships)
);

export const selectMyActiveMembershipsForCreatorId = (state: State, id: string) => {
  const myActiveMembershipsById = selectMyActiveMembershipsById(state);
  if (!myActiveMembershipsById) return myActiveMembershipsById;

  return myActiveMembershipsById[id] || null;
};

export const selectMyValidMembershipsForCreatorId = (state: State, id: string) => {
  const myValidMembershipsById = selectMyValidMembershipsById(state);
  if (!myValidMembershipsById) return myValidMembershipsById;

  return myValidMembershipsById[id] || null;
};

export const selectUserHasValidMembershipForCreatorId = (state: State, id: string) => {
  const validMemberships = selectMyValidMembershipsForCreatorId(state, id);
  return Boolean(validMemberships && validMemberships.length > 0);
};

export const selectUserHasValidOdyseeMembership = (state: State) =>
  selectUserHasValidMembershipForCreatorId(state, ODYSEE_CHANNEL.ID);

export const selectMyValidMembershipIds = createSelector(selectMyValidMembershipsById, (validMembershipsById) => {
  const validMembershipIds = new Set([]);

  for (const creatorId in validMembershipsById) {
    const memberships = validMembershipsById[creatorId];

    for (const membership of memberships) {
      validMembershipIds.add(membership.MembershipDetails.id);
    }
  }

  // $FlowFixMe
  return validMembershipIds.size ? Array.from(validMembershipIds) : null;
});

// -- Canceled Membership = status is 'canceled'
export const selectMyCanceledMembershipsById = createSelector(selectMembershipMineData, (myMembershipsByCreatorId) => {
  if (!myMembershipsByCreatorId) return myMembershipsByCreatorId;

  const canceledMembershipsById = {};

  for (const creatorChannelId in myMembershipsByCreatorId) {
    const purchasedCreatorMemberships = myMembershipsByCreatorId[creatorChannelId];

    for (const membership of purchasedCreatorMemberships) {
      if (membership.Subscription.status === 'canceled') {
        canceledMembershipsById[creatorChannelId] = new Set(canceledMembershipsById[creatorChannelId]);
        canceledMembershipsById[creatorChannelId].add(membership);
        // $FlowFixMe
        canceledMembershipsById[creatorChannelId] = Array.from(canceledMembershipsById[creatorChannelId]);
      }
    }
  }

  return canceledMembershipsById;
});

export const selectMyCanceledMembershipsForChannelClaimId = (state: State, id: string) => {
  const byId = selectMyCanceledMembershipsById(state);
  return byId && byId[id];
};

export const selectMyPurchasedMembershipsForChannelClaimId = (state: State, id: string) => {
  const byId = selectMembershipMineData(state);
  return byId && byId[id];
};

export const selectFetchingIdsForMembershipChannelId = (state: State, channelId: string) =>
  selectMembershipFetchingIdsByChannel(state)[channelId];

export const selectMembershipForCreatorIdAndChannelId = createCachedSelector(
  (state, creatorId, channelId) => channelId,
  selectChannelMembershipsForCreatorId,
  selectMyValidMembershipsForCreatorId,
  selectMyChannelClaimIds,
  (channelId, creatorMemberships, myValidCreatorMemberships, myChannelClaimIds) => {
    const channelIsMine = new Set(myChannelClaimIds).has(channelId);

    if (channelIsMine && myValidCreatorMemberships) {
      // -- For checking my own memberships, it is better to use the result of the 'mine'
      // call, which is cached and will be more up to date.
      const myMembership = myValidCreatorMemberships.find(
        (membership: MembershipTier) => membership.Membership.channel_id === channelId
      );

      return myMembership && myMembership.MembershipDetails.name;
    }

    return creatorMemberships && creatorMemberships[channelId];
  }
)((state, creatorId, channelId) => `${String(creatorId)}:${String(channelId)}`);

export const selectMembershipForCreatorOnlyIdAndChannelId = (state: State, creatorId: string, channelId: string) =>
  creatorId !== ODYSEE_CHANNEL.ID && selectMembershipForCreatorIdAndChannelId(state, creatorId, channelId);

export const selectMyValidOdyseeMemberships = (state: State) =>
  selectMyValidMembershipsForCreatorId(state, ODYSEE_CHANNEL.ID);

export const selectUserHasOdyseePremiumPlus = createSelector(selectMyValidOdyseeMemberships, (myValidMemberships) => {
  if (!myValidMemberships) return myValidMemberships === undefined ? undefined : false;

  // -- For checking my own memberships, it is better to use the result of the 'mine'
  // call, which is cached and will be more up to date.
  return myValidMemberships.some(
    (membership: MembershipTier) =>
      membership.MembershipDetails.name === MEMBERSHIP_CONSTS.ODYSEE_TIER_NAMES.PREMIUM_PLUS
  );
});

export const selectOdyseeMembershipForChannelId = (state: State, channelId: string) =>
  selectMembershipForCreatorIdAndChannelId(state, ODYSEE_CHANNEL.ID, channelId);
export const selectOdyseeMembershipIsPremiumPlus = (state: State, channelId: string) =>
  selectOdyseeMembershipForChannelId(state, channelId) === MEMBERSHIP_CONSTS.ODYSEE_TIER_NAMES.PREMIUM_PLUS;

export const selectMembershipsById = createSelector(selectMembershipsListByCreatorId, (byId) => {
  const membershipsById = {};

  for (const creatorId in byId) {
    const memberships = byId[creatorId];

    if (memberships) {
      memberships.forEach((membership) => {
        membershipsById[membership.Membership.id] = membership;
      });
    }
  }

  return membershipsById;
});

export const selectMembershipForId = (state: State, id: string) => selectMembershipsById(state)[id];

export const selectMembershipsByIdForChannelIds = createSelector(
  (state, ids) => ids,
  selectMembershipsListByCreatorId,
  (ids, byId) => {
    const membershipsById = {};

    ids.forEach((id) => {
      const membershipForId = byId[id];
      if (membershipForId) membershipsById[id] = membershipForId;
    });

    return membershipsById;
  }
);

export const selectMyMembershipTiersChannelById = (state: State) => {
  const myChannelClaimIds = selectMyChannelClaimIds(state);
  if (!myChannelClaimIds) return myChannelClaimIds;

  return selectMembershipsByIdForChannelIds(state, myChannelClaimIds);
};

export const userHasMembershipTiers = createSelector(selectMyMembershipTiersChannelById, (myMembershipsById) =>
  Boolean(myMembershipsById && Object.values(myMembershipsById).length > 0)
);

export const selectMembershipTiersForChannelUri = (state: State, uri: string) =>
  selectMembershipTiersForCreatorId(state, selectChannelClaimIdForUri(state, uri) || '');

export const selectOdyseeMembershipTiers = (state: State) =>
  selectMembershipTiersForCreatorId(state, ODYSEE_CHANNEL.ID);

export const selectCreatorMembershipsFetchedByUri = createSelector(
  selectMembershipTiersForChannelUri,
  (memberships) => memberships !== undefined
);

export const selectCreatorHasMembershipsByUri = createSelector(selectMembershipTiersForChannelUri, (memberships) =>
  Boolean(memberships?.length > 0)
);

export const selectMyPurchasedMembershipTierForCreatorUri = (state: State, creatorId: string) => {
  const myPurchasedCreatorMembership = selectMyPurchasedMembershipsForChannelClaimId(state, creatorId);
  if (!myPurchasedCreatorMembership) return myPurchasedCreatorMembership;

  const creatorMembershipTiers = selectMembershipTiersForCreatorId(state, creatorId);
  if (!creatorMembershipTiers) return creatorMembershipTiers;

  // This is needed because some data like Perks is present in membership_list call,
  // but returns null on membership_mine
  return Object.assign(
    {},
    myPurchasedCreatorMembership[0],
    creatorMembershipTiers.find(
      (membership) => membership.Membership.id === myPurchasedCreatorMembership[0].MembershipDetails.id
    )
  );
};

export const selectUserValidMembershipForChannelUri = createSelector(
  (state, uri) => selectMyPurchasedMembershipsForChannelClaimId(state, selectChannelClaimIdForUri(state, uri) || ''),
  (purchasedMembershipForChannel) => {
    if (!purchasedMembershipForChannel) return purchasedMembershipForChannel;

    // $FlowFixMe
    const subscriptionEndTime = purchasedMembershipForChannel[0].Subscription?.current_period_end;
    const currentTimeInStripeFormat = new Date().getTime() / 1000;
    const membershipIsValid = subscriptionEndTime && currentTimeInStripeFormat < subscriptionEndTime;

    return membershipIsValid ? purchasedMembershipForChannel[0] : null;
  }
);

export const selectProtectedContentMembershipsForClaimId = (state: State, channelId: string, claimId: string) => {
  const protectedClaimsById = selectProtectedContentClaimsForId(state, channelId);

  return protectedClaimsById && protectedClaimsById[claimId] && protectedClaimsById[claimId].memberships;
};
export const selectProtectedContentMembershipsForContentClaimId = (state: State, claimId: string) => {
  const claimChannelId = getChannelIdFromClaim(selectClaimForId(state, claimId));
  const protectedClaimsById = claimChannelId && selectProtectedContentClaimsForId(state, claimChannelId);

  return protectedClaimsById && protectedClaimsById[claimId] && protectedClaimsById[claimId].memberships;
};

export const selectContentHasProtectedMembershipIds = (state: State, claimId: string) => {
  const protectedContentMembershipIds = selectProtectedContentMembershipsForContentClaimId(state, claimId);
  const claim = selectClaimForId(state, claimId);
  const protectedContentTag = claim && selectProtectedContentTagForUri(state, claim.permanent_url);

  if (!protectedContentTag) return false;

  return protectedContentMembershipIds && protectedContentMembershipIds.length > 0;
};

export const selectProtectedContentMembershipsForId = (state: State, claimId: ClaimId) => {
  const claimChannelId = getChannelIdFromClaim(selectClaimForId(state, claimId));
  const protectedContentMembershipIds = new Set(
    claimChannelId && selectProtectedContentMembershipsForClaimId(state, claimChannelId, claimId)
  );
  const creatorMemberships = claimChannelId && selectMembershipTiersForCreatorId(state, claimChannelId);

  return (
    creatorMemberships &&
    creatorMemberships.filter((membership) => protectedContentMembershipIds.has(membership.Membership.id))
  );
};

export const selectMyProtectedContentMembershipForId = createSelector(
  selectProtectedContentMembershipsForId,
  selectMyValidMembershipIds,
  (protectedContentMemberships, validMembershipIds) => {
    if (!protectedContentMemberships) return protectedContentMemberships;

    const validMembershipIdsSet = new Set(validMembershipIds);
    const myMembership = protectedContentMemberships.find((membership) =>
      validMembershipIdsSet.has(membership.Membership.id)
    );
    if (!myMembership) return null;

    return myMembership;
  }
);

export const selectUserIsMemberOfProtectedContentForId = (state: State, claimId: ClaimId) =>
  Boolean(selectMyProtectedContentMembershipForId(state, claimId));

export const selectNoRestrictionOrUserIsMemberForContentClaimId = (state: State, claimId: ClaimId) => {
  const protectedContentMemberships = selectContentHasProtectedMembershipIds(state, claimId);
  if (protectedContentMemberships === undefined) return false;

  const userHasAccess = selectUserIsMemberOfProtectedContentForId(state, claimId);
  const claimIsMine = selectClaimIsMineForId(state, claimId);

  return Boolean(claimIsMine || !protectedContentMemberships || userHasAccess);
};

export const selectIsProtectedContentLockedFromUserForId = (state: State, claimId: ClaimId) => {
  const protectedContentMemberships = selectContentHasProtectedMembershipIds(state, claimId);
  const userHasAccess = selectUserIsMemberOfProtectedContentForId(state, claimId);
  const claimIsMine = selectClaimIsMineForId(state, claimId);

  return Boolean(!claimIsMine && protectedContentMemberships && !userHasAccess);
};

export const selectMembershipsSortedByPriceForRestrictedIds = createSelector(
  (state, restrictedIds) => restrictedIds,
  selectMembershipsById,
  (restrictedIds, byId) => {
    const memberships = restrictedIds.map((id) => byId[id]);

    return memberships.sort((a, b) => a.NewPrices[0].Price.amount - b.NewPrices[0].Price.amount);
  }
);

export const selectCheapestPlanForRestrictedIds = (state: State, restrictedIds: Array<string>) => {
  const sortedMemberships = selectMembershipsSortedByPriceForRestrictedIds(state, restrictedIds);
  return sortedMemberships && sortedMemberships[0];
};

export const selectCheapestProtectedContentMembershipForId = (state: State, claimId: ClaimId) => {
  const claimChannelId = getChannelIdFromClaim(selectClaimForId(state, claimId));
  const protectedContentMembershipIds =
    claimChannelId && selectProtectedContentMembershipsForClaimId(state, claimChannelId, claimId);

  return protectedContentMembershipIds && selectCheapestPlanForRestrictedIds(state, protectedContentMembershipIds);
};

export const selectPriceOfCheapestPlanForClaimId = (state: State, claimId: ClaimId) => {
  const cheapestMembership = selectCheapestProtectedContentMembershipForId(state, claimId);
  if (!cheapestMembership || !cheapestMembership.NewPrices) return undefined;

  return (cheapestMembership.NewPrices[0]?.creator_receives_amount / 100).toFixed(2);
};

export const selectMyMembershipTiersWithExclusiveContentPerk = (state: State, activeChannelClaimId: string) => {
  const membershipTiers: MembershipTiers = selectMembershipTiersForCreatorId(state, activeChannelClaimId);

  if (!membershipTiers) return [];

  const perkName = 'Exclusive content';

  const tiers: MembershipTiers = membershipTiers.filter((membershipTier: MembershipTier) => {
    return membershipTier.Perks && membershipTier.Perks.some((perk: MembershipOdyseePerk) => perk.name === perkName);
  });

  return tiers;
};

export const selectMyMembershipTiersWithExclusiveLivestreamPerk = (state: State, activeChannelClaimId: string) => {
  const membershipTiers: MembershipTiers = selectMembershipTiersForCreatorId(state, activeChannelClaimId);

  if (!membershipTiers) return [];

  const perkName = 'Exclusive livestreams';

  const tiers: MembershipTiers = membershipTiers.filter((membershipTier: MembershipTier) => {
    return membershipTier.Perks && membershipTier.Perks.some((perk: MembershipOdyseePerk) => perk.name === perkName);
  });

  return tiers;
};

export const selectMyMembershipTiersWithMembersOnlyChatPerk = (state: State, channelId: string) => {
  const membershipTiers: MembershipTiers = selectMembershipTiersForCreatorId(state, channelId);

  if (!membershipTiers) return [];

  const perkName = 'Members-only chat';

  const tiers: MembershipTiers = membershipTiers.filter((membershipTier: MembershipTier) => {
    return membershipTier.Perks && membershipTier.Perks.some((perk: MembershipOdyseePerk) => perk.name === perkName);
  });

  return tiers;
};

export const selectMembersOnlyChatMembershipIdsForCreatorId = createSelector(
  selectMembershipTiersForCreatorId,
  (memberships: CreatorMemberships) => {
    if (!memberships) return memberships;

    const membershipIds = new Set([]);

    memberships.forEach(
      (membership: CreatorMembership) =>
        membership.Perks &&
        membership.Perks.some((perk: MembershipOdyseePerk) => {
          if (perk.id === MEMBERSHIP_CONSTS.ODYSEE_PERKS.MEMBERS_ONLY_CHAT.id) {
            membershipIds.add(membership.Membership.id);
            return true;
          }
        })
    );

    return Array.from(membershipIds);
  }
);

export const selectMyMembersOnlyChatMembershipsForCreatorId = createSelector(
  selectMyValidMembershipsForCreatorId,
  (myValidMemberships: MembershipTiers) =>
    myValidMemberships &&
    myValidMemberships.filter(
      (membership: MembershipTier) =>
        membership.Perks &&
        membership.Perks.some(
          (perk: MembershipOdyseePerk) => perk.id === MEMBERSHIP_CONSTS.ODYSEE_PERKS.MEMBERS_ONLY_CHAT.id
        )
    )
);

export const selectUserIsMemberOfMembersOnlyChatForCreatorId = (state: State, creatorId: ClaimId) => {
  const myMembersOnlyChatMemberships = selectMyMembersOnlyChatMembershipsForCreatorId(state, creatorId);
  return !!myMembersOnlyChatMemberships && myMembersOnlyChatMemberships.length > 0;
};

export const selectNoRestrictionOrUserCanChatForCreatorId = (state: State, creatorId: ClaimId) => {
  const membersOnlyMembershipIds = selectMembersOnlyChatMembershipIdsForCreatorId(state, creatorId);
  if (membersOnlyMembershipIds === undefined) return false;

  const userHasAccess = selectUserIsMemberOfMembersOnlyChatForCreatorId(state, creatorId);
  const claimIsMine = selectClaimIsMineForId(state, creatorId);

  return Boolean(claimIsMine || !membersOnlyMembershipIds || userHasAccess);
};

export const selectChannelHasMembershipTiersForId = (state: State, channelId: string) => {
  const memberships = selectMembershipTiersForCreatorId(state, channelId);
  return memberships && memberships.length > 0;
};
