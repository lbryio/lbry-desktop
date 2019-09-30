import { HEADERS, Lbry } from 'lbry-redux';
import apiPublishCallViaWeb from './publish';

export const SDK_API_URL = process.env.SDK_API_URL || 'https://api.lbry.tv/api/v1/proxy';

Lbry.setDaemonConnectionString(SDK_API_URL);

Lbry.setOverride(
  'publish',
  params =>
    new Promise((resolve, reject) => {
      apiPublishCallViaWeb(
        SDK_API_URL,
        Lbry.getApiRequestHeaders() && Object.keys(Lbry.getApiRequestHeaders()).includes(HEADERS.AUTH_TOKEN)
          ? Lbry.getApiRequestHeaders()[HEADERS.AUTH_TOKEN]
          : '',
        'publish',
        params,
        resolve,
        reject
      );
    })
);
