// @flow
import { parseURI } from 'lbry-redux';

const LBRY_INC_DOMAINS = ['lbry.io', 'lbry.com', 'lbry.tv', 'lbry.tech', 'lbry.fund', 'spee.ch'];

export const formatLbryUriForWeb = (uri: string) => {
  const { claimName, claimId } = parseURI(uri);

  let webUrl = `/${claimName}`;
  if (claimId) {
    webUrl += `/${claimId}`;
  }

  return webUrl;
};

export const formatPathForWeb = (path: string) => {
  if (!path) {
    return;
  }

  let webUrl = path.replace(/\\/g, '/');

  if (webUrl[0] !== '/') {
    webUrl = `/${webUrl}`;
  }

  return encodeURI(`file://${webUrl}`).replace(/[?#]/g, encodeURIComponent);
};

export const isLBRYDomain = (uri: string) => {
  if (!uri) {
    return;
  }

  const myURL = new URL(uri);
  const hostname = myURL.hostname;

  for (let domain of LBRY_INC_DOMAINS) {
    if (hostname.endsWith(domain)) {
      return true;
    }
  }

  return false;
};
