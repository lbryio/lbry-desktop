// @flow
import { doToast } from 'redux/actions/notifications';

export function doFailedSignatureToast(dispatch: Dispatch, channelName: string) {
  dispatch(
    doToast({
      message: __('Unable to verify signature.'),
      subMessage: channelName,
      isError: true,
    })
  );
}

export function devToast(dispatch: Dispatch, msg: string) {
  // @if process.env.NODE_ENV!='production'
  console.error(msg); // eslint-disable-line
  dispatch(doToast({ isError: true, message: `DEV: ${msg}` }));
  // @endif
}
