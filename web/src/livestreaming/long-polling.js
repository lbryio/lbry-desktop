// @flow

/*
 * This module is responsible for long polling the server to determine if a channel is actively streaming.
 *
 * One or many entities can subscribe to the live status while instantiating just one long poll interval per channel.
 * Once all interested parties have disconnected the poll will shut down. For this reason, be sure to always call the
 * disconnect function returned upon connecting.
 */

import { isLiveStreaming } from '$web/src/livestreaming';

const POLL_INTERVAL = 30000; // 30 seconds.
const pollers = {};

const pollingMechanism = {
  streaming: false,

  startPolling() {
    if (this.interval !== 0) return;
    const poll = async () => {
      this.streaming = await isLiveStreaming(this.channelId);
      this.subscribers.forEach((cb) => {
        if (cb) cb(this.streaming);
      });
    };
    poll();
    this.interval = setInterval(poll, POLL_INTERVAL);
  },

  stopPolling() {
    clearInterval(this.interval);
    this.interval = 0;
  },

  connect(cb): number {
    cb(this.streaming);
    this.startPolling();
    return this.subscribers.push(cb) - 1;
  },

  disconnect(subscriberIndex: number) {
    this.subscribers[subscriberIndex] = null;
    if (this.subscribers.every((item) => item === null)) {
      this.stopPolling();
      delete pollers[this.channelId];
    }
  },
};

const generateLongPoll = (channelId: string) => {
  if (pollers[channelId]) return pollers[channelId];

  pollers[channelId] = Object.create({
    channelId,
    interval: 0,
    subscribers: [],
    ...pollingMechanism,
  });
  return pollers[channelId];
};

const watchLivestreamStatus = (channelId: ?string, cb: (boolean) => void) => {
  if (!channelId || typeof cb !== 'function') return undefined;
  const poll = generateLongPoll(channelId);
  const subscriberIndex = poll.connect(cb);
  return () => poll.disconnect(subscriberIndex);
};

export default watchLivestreamStatus;
