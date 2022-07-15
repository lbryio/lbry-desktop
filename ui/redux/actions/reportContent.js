// @flow
import * as ACTIONS from 'constants/action_types';
import { COPYRIGHT_ISSUES, OTHER_LEGAL_ISSUES } from 'constants/report_content';

type Dispatch = (action: any) => any;

export const doReportContent = (category: string, params: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTIONS.REPORT_CONTENT_STARTED,
  });

  let REPORT_URL;
  switch (category) {
    case COPYRIGHT_ISSUES:
      REPORT_URL = 'https://reports.odysee.tv/copyright_issue/new';
      break;
    case OTHER_LEGAL_ISSUES:
      REPORT_URL = 'https://reports.odysee.tv/other_legal_issue/new';
      break;
    default:
      REPORT_URL = 'https://reports.odysee.tv/common/new';
      break;
  }

  fetch(`${REPORT_URL}?${params}`, { method: 'POST' })
    .then((response) => {
      if (response) {
        response
          .json()
          .then((json) => {
            if (json.success) {
              dispatch({
                type: ACTIONS.REPORT_CONTENT_COMPLETED,
              });
            } else {
              dispatch({
                type: ACTIONS.REPORT_CONTENT_FAILED,
                data: json.error,
              });
            }
          })
          .catch((err) => {
            dispatch({
              type: ACTIONS.REPORT_CONTENT_FAILED,
              data: 'Server error: Invalid response',
            });
          });
      } else {
        dispatch({
          type: ACTIONS.REPORT_CONTENT_FAILED,
          data: 'Server error: No response',
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: ACTIONS.REPORT_CONTENT_FAILED,
        data: err,
      });
    });
};
