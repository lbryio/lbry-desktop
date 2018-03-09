import { createSelector } from 'reselect';
import { selectFeaturedUris } from './content';
import {
  selectClaimsById,
  selectAllClaimsByChannel
} from './claims';

export const selectDiscover = createSelector(
  [
    selectFeaturedUris,
    selectClaimsById,
    selectAllClaimsByChannel
  ],
  (
    featuredUris,
    claimsById,
    claimsByChannel
  ) => {
    let categories = featuredUris;
    if (!!categories && !!claimsByChannel) {
      let channels = [];
      Object.keys(categories).forEach(key => {
        if (key.indexOf("@") === 0) {
          channels.push(key);
        }
      });
      Object.keys(claimsByChannel).forEach(key => {
        if (channels.includes(key)) {
          delete categories[key];
          const ids = claimsByChannel[key][1];
          let uris = [];
          const newKey = `${key}#${claimsById[ids[0]].value.publisherSignature.certificateId}`;
          ids.forEach(id => {
            const claim = claimsById[id] ? claimsById[id] : null;
            if (claim) {
              uris.push(`${claim.name}#${claim.claim_id}`);
            }
          });
          categories[newKey] = uris;
        }
      });
    }
    return categories;
  }
)