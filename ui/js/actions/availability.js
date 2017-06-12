import * as types from "constants/action_types";
import lbry from "lbry";
import { selectFetchingAvailability } from "selectors/availability";

export function doFetchAvailability(uri) {
  return function(dispatch, getState) {
    const state = getState();
    const alreadyFetching = !!selectFetchingAvailability(state)[uri];

    if (!alreadyFetching) {
      dispatch({
        type: types.FETCH_AVAILABILITY_STARTED,
        data: { uri },
      });

      lbry.get_availability({ uri }).then(availability => {
        dispatch({
          type: types.FETCH_AVAILABILITY_COMPLETED,
          data: {
            availability,
            uri,
          },
        });
      });
    }
  };
}
