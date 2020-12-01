import { SDK_API_PATH } from 'ui';
import { useEffect } from 'react';
// import { getAuthToken } from 'util/saved-passwords';
// import { X_LBRY_AUTH_TOKEN } from 'constants/token';

import fetchWithTimeout from 'util/fetch';

const STATUS_TIMEOUT_LIMIT = 10000;
export const STATUS_OK = 'ok';
export const STATUS_DEGRADED = 'degraded';
export const STATUS_FAILING = 'failing';
export const STATUS_DOWN = 'down';

const getParams = () => {
  const headers = {};
  // const token = getAuthToken();
  // if (token) {
  //  headers[X_LBRY_AUTH_TOKEN] = token;
  // }
  const params = { headers };
  return params;
};

export function useDegradedPerformance(onDegradedPerformanceCallback) {
  useEffect(() => {
    // The status endpoint is the only endpoint at "v2" currently
    // This should be moved into the config once more endpoints are using it
    const STATUS_ENDPOINT = `${SDK_API_PATH}/status`.replace('v1', 'v2');

    fetchWithTimeout(STATUS_TIMEOUT_LIMIT, fetch(STATUS_ENDPOINT, getParams()))
      .then(response => response.json())
      .then(status => {
        if (status.general_state !== STATUS_OK) {
          onDegradedPerformanceCallback(STATUS_FAILING);
        }
      })
      .catch(() => {
        onDegradedPerformanceCallback(STATUS_FAILING);
      });
  }, [onDegradedPerformanceCallback]);
}
