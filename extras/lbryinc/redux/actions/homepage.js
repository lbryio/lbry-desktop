import { Lbryio } from 'lbryinc';
import { batchActions } from 'util/batch-actions';
import { doResolveUris } from 'util/lbryURI';
import * as ACTIONS from 'constants/action_types';

export function doFetchFeaturedUris(offloadResolve = false) {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_FEATURED_CONTENT_STARTED,
    });

    const success = ({ Uris }) => {
      let urisToResolve = [];
      Object.keys(Uris).forEach(category => {
        urisToResolve = [...urisToResolve, ...Uris[category]];
      });

      const actions = [
        {
          type: ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED,
          data: {
            uris: Uris,
            success: true,
          },
        },
      ];
      if (urisToResolve.length && !offloadResolve) {
        actions.push(doResolveUris(urisToResolve));
      }

      dispatch(batchActions(...actions));
    };

    const failure = () => {
      dispatch({
        type: ACTIONS.FETCH_FEATURED_CONTENT_COMPLETED,
        data: {
          uris: {},
        },
      });
    };

    Lbryio.call('file', 'list_homepage').then(success, failure);
  };
}

export function doFetchTrendingUris() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_TRENDING_CONTENT_STARTED,
    });

    const success = data => {
      const urisToResolve = data.map(uri => uri.url);
      const actions = [
        doResolveUris(urisToResolve),
        {
          type: ACTIONS.FETCH_TRENDING_CONTENT_COMPLETED,
          data: {
            uris: data,
            success: true,
          },
        },
      ];
      dispatch(batchActions(...actions));
    };

    const failure = () => {
      dispatch({
        type: ACTIONS.FETCH_TRENDING_CONTENT_COMPLETED,
        data: {
          uris: [],
        },
      });
    };

    Lbryio.call('file', 'list_trending').then(success, failure);
  };
}
