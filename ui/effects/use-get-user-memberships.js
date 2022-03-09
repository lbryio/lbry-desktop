// @flow
import { useState, useEffect } from 'react';
import { getChannelFromClaim } from 'util/claim';

export default function useGetUserMemberships(
  shouldFetchUserMemberships: ?boolean,
  arrayOfContentUris: ?Array<string>,
  convertClaimUrlsToIds: any,
  doFetchUserMemberships: (string) => void, // fetch membership values and save in redux
  dependency?: any,
  alreadyClaimIds?: boolean,
) {
  const [userMemberships, setUserMemberships] = useState([]);

  useEffect(() => {
    if (shouldFetchUserMemberships && arrayOfContentUris && arrayOfContentUris.length > 0) {
      const urisToFetch = arrayOfContentUris;

      let claimIds;
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
        claimIds = arrayOfContentUris;
      }

      const dedupedChannelIds = [...new Set(claimIds)];

      const channelClaimIdsToCheck = dedupedChannelIds.filter(
        // not in fetched claims but exists in array
        (claimId) => claimId && !userMemberships.includes(claimId)
      );

      const channelsToFetch = channelClaimIdsToCheck.filter(
        // not in fetched claims but exists in array
        (uri) => uri && !userMemberships.includes(uri)
      );

      const commaSeparatedStringOfIds = channelsToFetch.join(',');

      if (channelsToFetch && channelsToFetch.length > 0) {
        // hit membership/check and save it in redux

        const combinedArray = [...userMemberships, ...channelsToFetch];

        setUserMemberships(combinedArray);

        if (doFetchUserMemberships) {
          doFetchUserMemberships(commaSeparatedStringOfIds);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency || [arrayOfContentUris]);
}
