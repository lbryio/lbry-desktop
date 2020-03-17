import { LBRY_TV_API } from 'config';
import { useEffect } from 'react';
import fetchWithTimeout from 'util/fetch';

const STATUS_TIMEOUT_LIMIT = 10000;
export const STATUS_OK = 'ok';
export const STATUS_DEGRADED = 'degraded';
export const STATUS_DOWN = 'down';

export function useDegradedPerformance(onDegradedPerformanceCallback) {
  useEffect(() => {
    fetchWithTimeout(STATUS_TIMEOUT_LIMIT, fetch(`${LBRY_TV_API}/internal/status`))
      .then(response => response.json())
      .then(status => {
        if (status.general_state === STATUS_DEGRADED) {
          onDegradedPerformanceCallback(STATUS_DEGRADED);
        } else {
          onDegradedPerformanceCallback(STATUS_OK);
        }
      })
      .catch(() => {
        onDegradedPerformanceCallback(STATUS_DOWN);
      });
  }, []);
}
