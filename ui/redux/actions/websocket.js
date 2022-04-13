import * as ACTIONS from 'constants/action_types';
import { getAuthToken } from 'util/saved-passwords';
import { doNotificationList } from 'redux/actions/notifications';
import { doFetchChannelLiveStatus } from 'redux/actions/livestream';
import { SOCKETY_SERVER_API } from 'config';

const NOTIFICATION_WS_URL = `${SOCKETY_SERVER_API}/internal?id=`;
const COMMENT_WS_URL = `${SOCKETY_SERVER_API}/commentron?id=`;
const COMMENT_WS_SUBCATEGORIES = {
  COMMENTER: 'commenter',
  VIEWER: 'viewer',
};

let sockets = {};
let closingSockets = {};
let retryCount = 0;

const getCommentSocketUrl = (claimId, channelName) => {
  return `${COMMENT_WS_URL}${claimId}&category=${channelName}&sub_category=viewer`;
};

const getCommentSocketUrlForCommenter = (claimId, channelName) => {
  return `${COMMENT_WS_URL}${claimId}&category=${channelName}&sub_category=commenter`;
};

export const doSocketConnect = (url, cb, type) => {
  function connectToSocket() {
    if (sockets[url] !== undefined && sockets[url] !== null) {
      sockets[url].close();
      sockets[url] = null;
    }

    const timeToWait = retryCount ** 2 * 1000;
    setTimeout(() => {
      sockets[url] = new WebSocket(url);
      sockets[url].onopen = (e) => {
        retryCount = 0;
        console.log(`\nConnected to ${type} WS \n\n`); // eslint-disable-line
      };

      sockets[url].onmessage = (e) => {
        const data = JSON.parse(e.data);
        cb(data);
      };

      sockets[url].onerror = (e) => {
        console.log(`${type} websocket onerror`, e); // eslint-disable-line
        // onerror and onclose will both fire, so nothing is needed here
      };

      sockets[url].onclose = () => {
        console.log(`\n Disconnected from ${type} WS \n\n`); // eslint-disable-line
        if (!closingSockets[url]) {
          retryCount += 1;
          connectToSocket();
        } else {
          closingSockets[url] = null;
        }
      };
    }, timeToWait);
  }

  connectToSocket();
};

export const doSocketDisconnect = (url) => (dispatch) => {
  if (sockets[url] !== undefined && sockets[url] !== null) {
    closingSockets[url] = true;
    sockets[url].close();
    sockets[url] = null;

    dispatch({
      type: ACTIONS.WS_DISCONNECT,
    });
  }
};

export const doNotificationSocketConnect = (enableNotifications) => (dispatch) => {
  const authToken = getAuthToken();
  if (!authToken) {
    console.error('Unable to connect to web socket because auth token is missing'); // eslint-disable-line
    return;
  }

  const url = `${NOTIFICATION_WS_URL}${authToken}`;

  doSocketConnect(
    url,
    (data) => {
      switch (data.type) {
        case 'pending_notification':
          if (enableNotifications) {
            dispatch(doNotificationList());
          }
          break;
        case 'swap-status':
          dispatch({
            type: ACTIONS.COIN_SWAP_STATUS_RECEIVED,
            data: data.data,
          });
          break;
      }
    },
    'notification'
  );
};

export const doCommentSocketConnect = (uri, channelName, claimId, subCategory) => (dispatch) => {
  const url =
    subCategory === COMMENT_WS_SUBCATEGORIES.COMMENTER
      ? getCommentSocketUrlForCommenter(claimId, channelName)
      : getCommentSocketUrl(claimId, channelName);

  doSocketConnect(
    url,
    (response) => {
      if (response.type === 'delta') {
        const newComment = response.data.comment;
        dispatch({
          type: ACTIONS.COMMENT_RECEIVED,
          data: { comment: newComment, claimId, uri },
        });
      }
      if (response.type === 'viewers') {
        const connected = response.data.connected;
        dispatch({
          type: ACTIONS.VIEWERS_RECEIVED,
          data: { connected, claimId },
        });
      }
      if (response.type === 'pinned') {
        const pinnedComment = response.data.comment;
        dispatch({
          type: ACTIONS.COMMENT_PIN_COMPLETED,
          data: {
            pinnedComment: pinnedComment,
            claimId,
            unpin: !pinnedComment.is_pinned,
          },
        });
      }
      if (response.type === 'removed') {
        const { comment_id } = response.data.comment;
        dispatch({
          type: ACTIONS.COMMENT_MARK_AS_REMOVED,
          data: { comment_id },
        });
      }

      if (response.type === 'livestream') {
        const { channel_id } = response.data;

        // update the live status for the stream
        dispatch(doFetchChannelLiveStatus(channel_id));
      }
    },
    'comment'
  );

  dispatch(doSetSocketConnected(true));
};

export const doCommentSocketDisconnect = (claimId, channelName) => (dispatch) => {
  const url = getCommentSocketUrl(claimId, channelName);

  dispatch(doSocketDisconnect(url));
  dispatch(doSetSocketConnected(false));
};

export const doCommentSocketConnectAsCommenter = (uri, channelName, claimId) => (dispatch) => {
  dispatch(doCommentSocketConnect(uri, channelName, claimId, COMMENT_WS_SUBCATEGORIES.COMMENTER));
};

export const doCommentSocketDisconnectAsCommenter = (claimId, channelName) => (dispatch) => {
  const url = getCommentSocketUrlForCommenter(claimId, channelName);

  dispatch(doSocketDisconnect(url));
};

export const doSetSocketConnected = (connected) => (dispatch) =>
  dispatch({
    type: ACTIONS.COMMENT_SOCKET_CONNECTED,
    data: { connected },
  });
