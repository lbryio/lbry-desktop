import { SDK_API_PATH } from 'ui';
import { useEffect } from 'react';

import fetchWithTimeout from 'util/fetch';

const STATUS_TIMEOUT_LIMIT = 10000;
export const STATUS_OK = 'ok';
export const STATUS_DEGRADED = 'degraded';
export const STATUS_FAILING = 'failing';
export const STATUS_DOWN = 'down';

export function useDegradedPerformance(onDegradedPerformanceCallback) {
  useEffect(() => {
    // The status endpoint is the only endpoint at "v2" currently
    // This should be moved into the config once more endpoints are using it
    const STATUS_ENDPOINT = `${SDK_API_PATH}/status`.replace('v1', 'v2');

    fetchWithTimeout(STATUS_TIMEOUT_LIMIT, fetch(STATUS_ENDPOINT))
      .then(response => response.json())
      .then(status => {
        if (status.general_state !== STATUS_OK) {
          onDegradedPerformanceCallback(STATUS_FAILING);
        }
      })
      .catch(() => {
        onDegradedPerformanceCallback(STATUS_FAILING);
      });
  }, []);
}
