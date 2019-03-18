// @flow
/* eslint-disable no-use-before-define */
export type GetState = () => any;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: {} | Promise<*> | Array<{}> | ThunkAction) => any; // Need to refer to ThunkAction
/* eslint-enable */
