// @flow

import Lbry from 'lbry';
import { LIVESTREAM_KILL, LIVESTREAM_LIVE_API } from 'constants/livestream';
import { toHex } from 'util/hex';

type StreamData = {
  d: string,
  s: string,
  t: string,
};

export const getStreamData = async (channelId: string, channelName: string): Promise<StreamData> => {
  if (!channelId || !channelName) throw new Error('Invalid channel data provided.');

  const channelNameHex = toHex(channelName);
  let channelSignature;

  try {
    channelSignature = await Lbry.channel_sign({ channel_id: channelId, hexdata: channelNameHex });
    if (!channelSignature || !channelSignature.signature || !channelSignature.signing_ts) {
      throw new Error('Error getting channel signature.');
    }
  } catch (e) {
    throw e;
  }

  return { d: channelNameHex, s: channelSignature.signature, t: channelSignature.signing_ts };
};

export const killStream = async (channelId: string, channelName: string) => {
  try {
    const streamData = await getStreamData(channelId, channelName);
    fetch(`${LIVESTREAM_KILL}/${channelId}`, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(streamData),
    }).then((res) => {
      if (res.status !== 200) throw new Error('Kill stream API failed.');
    });
  } catch (e) {
    throw e;
  }
};

export const isLiveStreaming = async (channelId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${LIVESTREAM_LIVE_API}/${channelId}`);
    const stream = await response.json();
    return stream.data?.live;
  } catch {
    return false;
  }
};
