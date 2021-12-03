// @flow
import analytics, { GA_DIMENSIONS } from 'analytics';
import * as ACTIONS from 'constants/action_types';

export function createAnalyticsMiddleware() {
  return (/* { dispatch, getState } */) => (next: any) => (action: {
    type: string,
    data: any,
    actions: Array<any>,
  }) => {
    if (action.type === 'BATCH_ACTIONS') {
      action.actions.forEach((a) => handleAnalyticsForAction(a));
    } else {
      handleAnalyticsForAction(action);
    }

    return next(action);
  };
}

function handleAnalyticsForAction(action: { type: string, data: any }) {
  switch (action.type) {
    case ACTIONS.SUPPORT_TRANSACTION_COMPLETED:
      {
        const { amount, type } = action.data;
        analytics.reportEvent('spend_virtual_currency', {
          // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#spend_virtual_currency
          value: amount,
          virtual_currency_name: 'lbc',
          item_name: type,
        });
      }
      break;

    case ACTIONS.COMMENT_CREATE_COMPLETED:
      analytics.reportEvent('comments', {
        [GA_DIMENSIONS.ACTION]: 'create',
      });
      break;

    case ACTIONS.COMMENT_CREATE_FAILED:
      analytics.reportEvent('comments', {
        [GA_DIMENSIONS.ACTION]: 'create_fail',
      });
      break;

    case ACTIONS.PUBLISH_SUCCESS:
      {
        const { type } = action.data;
        analytics.reportEvent('publish', {
          [GA_DIMENSIONS.ACTION]: 'publish_success',
          [GA_DIMENSIONS.TYPE]: type,
        });
      }
      break;

    case ACTIONS.PUBLISH_FAIL:
      analytics.reportEvent('publish', {
        [GA_DIMENSIONS.ACTION]: 'publish_fail',
      });
      break;

    case ACTIONS.AUTHENTICATION_STARTED:
      analytics.eventStarted('diag_authentication', Date.now());
      break;

    case ACTIONS.AUTHENTICATION_SUCCESS:
      analytics.eventCompleted('diag_authentication', Date.now());
      break;

    default:
      // Do nothing
      break;
  }
}
