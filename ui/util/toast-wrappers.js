// @flow
import { doToast } from 'redux/actions/notifications';

export function dispatchToast(
  dispatch: Dispatch,
  message: string,
  subMessage: string = '',
  duration: 'default' | 'long' = 'default',
  isError: boolean = true
) {
  return dispatch(doToast({ message, subMessage: subMessage || undefined, duration: duration, isError }));
}

export function doFailedSignatureToast(dispatch: Dispatch, channelName: string) {
  return dispatchToast(dispatch, __('Unable to verify signature.'), channelName);
}

export function devToast(dispatch: Dispatch, msg: string) {
  // @if process.env.NODE_ENV!='production'
  console.error(msg); // eslint-disable-line
  dispatch(doToast({ isError: true, message: `DEV: ${msg}` }));
  // @endif
}
