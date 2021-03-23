import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';

let socket = null;
let retryCount = 0;

export const doSocketConnect = () => dispatch => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  function connectToSocket() {
    if (socket !== null) {
      socket.close();
      socket = null;
    }

    const timeToWait = retryCount ** 2 * 1000;
    setTimeout(() => {
      const url = `wss://api.lbry.com/subscribe?auth_token=${authToken}`;
      socket = new WebSocket(url);
      socket.onopen = e => {
        retryCount = 0;
        console.log('\nConnected to WS \n\n'); // eslint-disable-line
      };
      socket.onmessage = e => {
        const data = JSON.parse(e.data);

        if (data.type === 'pending_notification') {
          dispatch(doNotificationList());
        }
      };

      socket.onerror = e => {
        console.error('websocket onerror', e); // eslint-disable-line
        // onerror and onclose will both fire, so nothing is needed here
      };

      socket.onclose = e => {
        console.error('websocket onclose', e); // eslint-disable-line
        retryCount += 1;
        connectToSocket();
      };
    }, timeToWait);
  }

  connectToSocket();
};

export const doSocketDisconnect = () => ({
  type: ACTIONS.WS_DISCONNECT,
});
