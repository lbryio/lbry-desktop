// @flow
import analytics, { GA_DIMENSIONS } from 'analytics';
import * as ACTIONS from 'constants/action_types';

export function createAnalyticsMiddleware() {
  return (/* { dispatch, getState } */) => (next: any) => (action: { type: string, data: any }) => {
    switch (action.type) {
      case ACTIONS.SUPPORT_TRANSACTION_COMPLETED:
        const { amount, type } = action.data;
        analytics.reportEvent('spend_virtual_currency', {
          // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#spend_virtual_currency
          value: amount,
          virtual_currency_name: 'lbc',
          item_name: type,
        });
        break;

      case ACTIONS.COMMENT_CREATE_COMPLETED:
        analytics.reportEvent('comments', {
          [GA_DIMENSIONS.TYPE]: 'create',
        });
        break;

      case ACTIONS.COMMENT_CREATE_FAILED:
        analytics.reportEvent('comments', {
          [GA_DIMENSIONS.TYPE]: 'create_fail',
        });
        break;

      case ACTIONS.PUBLISH_SUCCESS:
        analytics.reportEvent('publish', {
          [GA_DIMENSIONS.TYPE]: 'publish_success',
        });
        break;

      case ACTIONS.PUBLISH_FAIL:
        analytics.reportEvent('publish', {
          [GA_DIMENSIONS.TYPE]: 'publish_fail',
        });
        break;

      default:
        // Do nothing
        break;
    }

    return next(action);
  };
}
