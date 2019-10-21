import { DOMAIN } from 'config';

export function generateStreamUrl(claimName, claimId) {
  const prefix = process.env.SDK_API_URL || DOMAIN;
  return `${prefix}/content/claims/${claimName}/${claimId}/stream`;
}
