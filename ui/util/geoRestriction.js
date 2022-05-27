// @flow
import { getChannelIdFromClaim, isStreamPlaceholderClaim } from 'util/claim';

/**
 * Returns the geo restriction for the given claim, or null if not restricted.
 *
 * @param claim
 * @param locale
 * @param geoBlockLists
 * @returns {{id: string, trigger?: string, reason?: string, message?:
 *   string}|null}
 */
export function getGeoRestrictionForClaim(claim: ?StreamClaim, locale: LocaleInfo, geoBlockLists: ?GBL) {
  if (locale && geoBlockLists && claim) {
    const claimId: ?string = claim.claim_id;
    const channelId: ?string = getChannelIdFromClaim(claim);

    let geoConfig: ?GeoConfig;

    // --- livestreams
    if (isStreamPlaceholderClaim(claim) && geoBlockLists.livestreams) {
      // $FlowIgnore: null key is fine
      geoConfig = geoBlockLists.livestreams[channelId] || geoBlockLists.livestreams[claimId];
    }
    // --- videos (actually, everything else)
    else if (geoBlockLists.videos) {
      // $FlowIgnore: null key is fine
      geoConfig = geoBlockLists.videos[channelId] || geoBlockLists.videos[claimId];
    }

    if (geoConfig) {
      const specials = geoConfig.specials || [];
      const countries = geoConfig.countries || [];
      const continents = geoConfig.continents || [];

      return (
        specials.find((x: GeoRestriction) => x.id === 'EU-ONLY' && locale.is_eu_member) ||
        countries.find((x: GeoRestriction) => x.id === locale.country) ||
        continents.find((x: GeoRestriction) => x.id === locale.continent)
      );
    }
  }

  return null;
}
