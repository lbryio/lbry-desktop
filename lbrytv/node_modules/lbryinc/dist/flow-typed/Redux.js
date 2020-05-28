// @flow

// eslint-disable-next-line no-use-before-define
export type Dispatch<T> = (action: T | Promise<T> | Array<T> | ThunkAction<T>) => any; // Need to refer to ThunkAction
export type GetState = () => any;
