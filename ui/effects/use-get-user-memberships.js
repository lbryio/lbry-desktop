// @flow
import { useState, useEffect } from 'react';
import { getChannelFromClaim } from 'util/claim';

export default function useGetUserMemberships(
  shouldFetchUserMemberships: ?boolean,
  arrayOfContentUris: ?Array<string>,
  convertClaimUrlsToIds: any, //
  doFetchUserMemberships: (string) => void, // fetch membership values and save in redux
  dependency?: any,
  alreadyClaimIds?: boolean,
) {
  const [userMemberships, setUserMemberships] = useState([]);
  const checkedMemberships = window.checkedMemberships || {};

  useEffect(() => {
    // run if there's uris to check
    if (shouldFetchUserMemberships && arrayOfContentUris && arrayOfContentUris.length > 0) {
      const urisToFetch = arrayOfContentUris;

      let claimIds;
      // convert content urls to channel claim ids
      if (!alreadyClaimIds) {
        claimIds = urisToFetch.map((uri) => {
          // get claim id from array
          const claimUrlsToId = convertClaimUrlsToIds[uri];

          if (claimUrlsToId) {
            const { claim_id: claimId } = getChannelFromClaim(claimUrlsToId) || {};
            return claimId;
          }
        });
      } else {
        // call already comes with an array of channel claim ids
        claimIds = arrayOfContentUris;
      }

      const dedupedChannelIds = [...new Set(claimIds)];

      console.log('running here!');

      // TODO: change here
      // check if channel id has already been fetched
      const channelsToFetch = dedupedChannelIds.filter(
        (channelClaimId) => channelClaimId && !checkedMemberships[channelClaimId]
        // (channelClaimId) => channelClaimId && !userMemberships.includes(channelClaimId)
      );

      console.log('just checked');

      const commaSeparatedStringOfIds = channelsToFetch.join(',');

      // new channels to hit, hit check api and save in state
      if (channelsToFetch && channelsToFetch.length > 0) {
        console.log('channels to fetch!');
        console.log(channelsToFetch);

        // save updated checked channels in state
        const combinedArray = [...userMemberships, ...channelsToFetch];
        setUserMemberships(combinedArray);

        let membershipsToAdd = {};
        for (const channelToFetch of channelsToFetch) {
          membershipsToAdd[channelToFetch] = 'waiting';
        }

        const combinedMemberships = Object.assign(checkedMemberships, membershipsToAdd);
        console.log(combinedMemberships);

        window.checkedMemberships = combinedMemberships;

        // hit membership/check and save it in redux
        if (doFetchUserMemberships) {
          doFetchUserMemberships(commaSeparatedStringOfIds);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency || [arrayOfContentUris]);
}
