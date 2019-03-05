// eslint-disable-next-line import/prefer-default-export
export function doFetchAvailability() {
  return () => {
    /*
    this is disabled atm - Jeremy
     */
    // const state = getState();
    // const alreadyFetching = !!selectFetchingAvailability(state)[uri];
    //
    // if (!alreadyFetching) {
    //   dispatch({
    //     type: ACTIONS.FETCH_AVAILABILITY_STARTED,
    //     data: { uri },
    //   });
    //
    //   lbry.get_availability({ uri }).then(availability => {
    //     dispatch({
    //       type: ACTIONS.FETCH_AVAILABILITY_COMPLETED,
    //       data: {
    //         availability,
    //         uri,
    //       },
    //     });
    //   });
    // }
  };
}
