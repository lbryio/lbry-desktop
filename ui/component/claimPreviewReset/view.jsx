// @flow

import React from 'react';
import Lbry from 'lbry';
import { LIVESTREAM_KILL } from 'constants/livestream';
import { SITE_HELP_EMAIL } from 'config';
import { toHex } from 'util/hex';
import Button from 'component/button';
import 'scss/component/claim-preview-reset.scss';

// @Todo: move out of component.
const getStreamData = async (channelId: string, channelName: string) => {
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

  return {
    d: channelNameHex,
    s: channelSignature.signature,
    t: channelSignature.signing_ts,
  };
};

// @Todo: move out of component.
const killStream = async (channelId: string, payload: any) => {
  fetch(`${LIVESTREAM_KILL}/${channelId}`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(payload),
  })
    .then((res) => {
      if (!res.status === 200) throw new Error('Kill stream API failed.');
    })
    .catch((e) => {
      throw e;
    });
};

type Props = {
  channelId: string,
  channelName: string,
  doToast: ({ message: string, isError?: boolean }) => void,
};

const ClaimPreviewReset = (props: Props) => {
  const { channelId, channelName, doToast } = props;

  const handleClick = async () => {
    try {
      const streamData = await getStreamData(channelId, channelName);
      await killStream(channelId, streamData);
      doToast({ message: __('Live stream successfully reset.'), isError: false });
    } catch {
      doToast({ message: __('There was an error resetting the live stream.'), isError: true });
    }
  };

  return (
    <p className={'claimPreviewReset'}>
      <span className={'claimPreviewReset__hint'}>
        {__(
          "If you're having trouble starting a stream or if your stream shows that you're live but aren't, try a reset. If the problem persists, please reach out at %SITE_HELP_EMAIL%.",
          { SITE_HELP_EMAIL }
        )}
      </span>
      <Button
        button="primary"
        label={__('Reset stream')}
        className={'claimPreviewReset__button'}
        onClick={handleClick}
      />
    </p>
  );
};

export default ClaimPreviewReset;
