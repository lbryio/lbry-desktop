// @flow
import { useEffect } from 'react';
import { getChannelFromClaim } from 'util/claim';

export default function useGetUserMemberships(
  shouldFetchUserMemberships: ?boolean,
  arrayOfContentUris: ?Array<string>,
  convertClaimUrlsToIds: any, //
  doFetchUserMemberships: (string) => void, // fetch membership values and save in redux
  dependency?: any,
  alreadyClaimIds?: boolean
) {
  // instantiate variable if it doesn't exist yet
  if (!window.checkedMemberships) window.checkedMemberships = {};

  useEffect(() => {
    // run if there's uris to check
    if (shouldFetchUserMemberships && arrayOfContentUris && arrayOfContentUris.length > 0) {
      const urisToFetch = arrayOfContentUris;

      let claimIds;
      // convert content urls to channel claim ids
      if (!alreadyClaimIds) {
        claimIds = urisToFetch.map((uri) => {
          // get claim id
          const contentClaimId = convertClaimUrlsToIds[uri];
          // return channel claim id
          if (contentClaimId) return getChannelFromClaim(contentClaimId)?.claim_id;
        });
      } else {
        // call already comes with an array of channel claim ids
        claimIds = arrayOfContentUris;
      }

      // remove dupes and falsey values
      const dedupedChannelIds = [...new Set(claimIds)].filter(Boolean);

      // check if channel id has already been fetched
      const channelsToFetch = dedupedChannelIds.filter(
        // if value exists or is null it's been through the backend
        (channelClaimId) =>
          !window.checkedMemberships[channelClaimId] && window.checkedMemberships[channelClaimId] !== null
      );

      // create csv string for backend
      const commaSeparatedStringOfIds = channelsToFetch.join(',');

      // new channels to hit, hit check api and save in state
      if (channelsToFetch && channelsToFetch.length > 0) {
        // setup object to be added to window
        let membershipsToAdd = {};
        for (const channelToFetch of channelsToFetch) {
          // mark as waiting while waiting for backend, so won't recall
          membershipsToAdd[channelToFetch] = 'waiting';
        }

        // update checked memberships
        window.checkedMemberships = Object.assign(window.checkedMemberships, membershipsToAdd);

        // hit membership/check and save it in redux
        if (doFetchUserMemberships) {
          doFetchUserMemberships(commaSeparatedStringOfIds);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency || [arrayOfContentUris]);
}
