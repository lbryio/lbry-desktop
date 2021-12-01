import { SDK_API_PATH } from 'config';
import { useEffect } from 'react';
import { getAuthToken } from 'util/saved-passwords';
import { X_LBRY_AUTH_TOKEN } from 'constants/token';

import fetchWithTimeout from 'util/fetch';

const STATUS_GENERAL_STATE = {
  // internal/status/status.go#L44
  OK: 'ok',
  NOT_READY: 'not_ready',
  OFFLINE: 'offline',
  FAILING: 'failing',
};

const STATUS_TIMEOUT_LIMIT = 10000;
export const STATUS_OK = 'ok';
export const STATUS_DEGRADED = 'degraded';
export const STATUS_FAILING = 'failing';
export const STATUS_DOWN = 'down';

const getParams = (user) => {
  const headers = {};
  const token = getAuthToken();
  if (token && user && user.has_verified_email) {
    headers[X_LBRY_AUTH_TOKEN] = token;
  }
  const params = { headers };
  return params;
};

export function useDegradedPerformance(onDegradedPerformanceCallback, user) {
  const hasUser = user !== undefined && user !== null;

  useEffect(() => {
    if (hasUser) {
      // The status endpoint is the only endpoint at "v2" currently
      // This should be moved into the config once more endpoints are using it
      const STATUS_ENDPOINT = `${SDK_API_PATH}/status`.replace('v1', 'v2');

      fetchWithTimeout(STATUS_TIMEOUT_LIMIT, fetch(STATUS_ENDPOINT, getParams(user)))
        .then((response) => response.json())
        .then((status) => {
          if (status.general_state === STATUS_GENERAL_STATE.OFFLINE) {
            onDegradedPerformanceCallback(STATUS_DOWN);
          } else if (status.general_state !== STATUS_GENERAL_STATE.OK) {
            onDegradedPerformanceCallback(STATUS_FAILING);
          }
        })
        .catch(() => {
          onDegradedPerformanceCallback(STATUS_FAILING);
        });
    }
  }, [hasUser]);
}
