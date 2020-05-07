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
    fetchWithTimeout(STATUS_TIMEOUT_LIMIT, fetch(`${SDK_API_PATH}/status`))
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
