// @flow
/* eslint-disable no-use-before-define */
declare type GetState = () => any;
declare type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
declare type Dispatch = (action: {} | Promise<*> | Array<{}> | ThunkAction) => any; // Need to refer to ThunkAction
/* eslint-enable */
