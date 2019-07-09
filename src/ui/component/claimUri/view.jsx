// @flow
import React from 'react';
import { clipboard } from 'electron';
import Button from 'component/button';

type Props = {
  shortUrl: ?string,
  uri: string,
  doToast: ({ message: string }) => void,
};

function ClaimUri(props: Props) {
  const { shortUrl, uri, doToast } = props;

  return (
    <Button
      className="media__uri"
      button="alt"
      label={shortUrl || uri}
      onClick={() => {
        clipboard.writeText(shortUrl || uri);
        doToast({
          message: __('Copied'),
        });
      }}
    />
  );
}

export default ClaimUri;
