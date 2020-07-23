import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';

let socket = null;
export const doSocketConnect = () => dispatch => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  if (socket !== null) {
    socket.close();
  }

  socket = new WebSocket(`wss://api.lbry.com/subscribe?auth_token=${authToken}`);

  socket.onmessage = e => {
    const data = JSON.parse(e.data);

    if (data.type === 'pending_notification') {
      dispatch(doNotificationList());
    }
  };

  socket.onerror = e => {
    console.error('Error connecting to websocket', e); // eslint-disable-line
  };

  socket.onclose = e => {
    // Reconnect?
  };

  socket.onopen = e => {
    console.log('\nConnected to WS \n\n'); // eslint-disable-line
  };
};

export const doSocketDisconnect = () => ({
  type: ACTIONS.WS_DISCONNECT,
});
