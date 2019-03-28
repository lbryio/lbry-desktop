// @flow
import { parseURI } from 'lbry-redux';

export const formatLbryUriForWeb = (uri: string) => {
  const { claimName, claimId } = parseURI(uri);

  let webUrl = `/${claimName}`;
  if (claimId) {
    webUrl += `/${claimId}`;
  }

  return webUrl;
};
