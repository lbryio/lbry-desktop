type GetState = () => any;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: {} | Promise<any> | Array<{}> | ThunkAction) => any; // Need to refer to ThunkAction
