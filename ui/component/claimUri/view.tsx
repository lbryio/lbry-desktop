import React from "react";
import classnames from "classnames";
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { clipboard } from "electron";
import Button from "component/button";

type Props = {
  shortUrl: string | null | undefined;
  uri: string;
  doToast: (arg1: { message: string }) => void;
  inline?: boolean;
  noShortUrl?: boolean;
};

function ClaimUri(props: Props) {
  const { shortUrl, uri, doToast, inline = false, noShortUrl = false } = props;

  return (
    <Button
      // @ts-expect-error - TS2322 (ts-migration)
      button="link"
      className={classnames("media__uri", { "media__uri--inline": inline })}
      label={noShortUrl ? uri : shortUrl || uri}
      onClick={() => {
        clipboard.writeText(shortUrl || uri);
        doToast({
          message: __("Copied"),
        });
      }}
    />
  );
}

export default ClaimUri;
