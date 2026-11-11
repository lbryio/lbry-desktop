import React from "react";
import { parseURI } from "util/lbryURI";
import classnames from "classnames";
// @ts-expect-error - TS2792 - Cannot find module './gerbil.png'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import Gerbil from "./gerbil.png";
import FreezeframeWrapper from "component/fileThumbnail/FreezeframeWrapper";
import ChannelStakedIndicator from "component/channelStakedIndicator";
import OptimizedImage from "component/optimizedImage";
import { AVATAR_DEFAULT } from "config";

type Props = {
  thumbnail: string | null | undefined;
  uri: string;
  className?: string;
  thumbnailPreview: string | null | undefined;
  obscure?: boolean;
  small?: boolean;
  // @ts-expect-error - TS2300 - Duplicate identifier 'xsmall'.
  xsmall?: boolean;
  allowGifs?: boolean;
  claim: ChannelClaim | null | undefined;
  doResolveUri: (arg1: string) => void;
  isResolving: boolean;
  showDelayedMessage?: boolean;
  noLazyLoad?: boolean;
  hideStakedIndicator?: boolean;
  hideTooltip?: boolean;
  // @ts-expect-error - TS2300 - Duplicate identifier 'xsmall'.
  xsmall?: boolean;
  noOptimization?: boolean;
  setThumbUploadError: (arg1: boolean) => void;
  ThumbUploadError: boolean;
};

function ChannelThumbnail(props: Props) {
  const {
    thumbnail: rawThumbnail,
    uri,
    className,
    thumbnailPreview: rawThumbnailPreview,
    obscure,
    small = false,
    xsmall = false,
    allowGifs = false,
    claim,
    doResolveUri,
    isResolving,
    showDelayedMessage = false,
    noLazyLoad,
    hideStakedIndicator = false,
    hideTooltip,
    setThumbUploadError,
    ThumbUploadError,
  } = props;
  const [retries, setRetries] = React.useState(3);
  const [thumbLoadError, setThumbLoadError] = React.useState(ThumbUploadError);
  const shouldResolve = !isResolving && claim === undefined;
  const thumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, "https://");
  const thumbnailPreview = rawThumbnailPreview && rawThumbnailPreview.trim().replace(/^http:\/\//i, "https://");
  const defaultAvatar = AVATAR_DEFAULT || Gerbil;
  const channelThumbnail = thumbnailPreview || thumbnail || defaultAvatar;
  const isGif = channelThumbnail && channelThumbnail.endsWith("gif");
  const showThumb = (!obscure && !!thumbnail) || thumbnailPreview;
  const avatarSrc = React.useMemo(() => {
    if (retries <= 0) {
      return defaultAvatar;
    }
    if (!thumbLoadError) {
      return channelThumbnail;
    }
    return defaultAvatar;
  }, [retries, thumbLoadError, channelThumbnail, defaultAvatar]);

  // Generate a random color class based on the first letter of the channel name
  const { channelName } = parseURI(uri);
  let initializer;
  let colorClassName;
  if (channelName) {
    initializer = channelName.charCodeAt(0) - 65; // will be between 0 and 57
    colorClassName = `channel-thumbnail__default--${Math.abs(initializer % 4)}`;
  } else {
    colorClassName = `channel-thumbnail__default--4`;
  }

  React.useEffect(() => {
    if (shouldResolve && uri) {
      doResolveUri(uri);
    }
  }, [doResolveUri, shouldResolve, uri]);

  if (isGif && !allowGifs) {
    return (
      // @ts-expect-error - TS2322 - Type '{ children: Element; src: any; className: any; }' is not assignable to type 'IntrinsicAttributes & Pick<unknown, never> & Pick<InferProps<{ src: Validator<string>; className: Validator<string>; }>, "src" | "className">'.
      <FreezeframeWrapper src={channelThumbnail} className={classnames("channel-thumbnail", className)}>
        {/* @ts-expect-error - TS2322 (ts-migration) */}
        {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} hideTooltip={hideTooltip} />}
      </FreezeframeWrapper>
    );
  }

  return (
    <div
      className={classnames("channel-thumbnail", className, {
        [colorClassName]: !showThumb,
        "channel-thumbnail--small": small,
        "channel-thumbnail--xsmall": xsmall,
        "channel-thumbnail--resolving": isResolving,
      })}
    >
      {/* show delay necessary? */}
      {showDelayedMessage ? (
        <div className="channel-thumbnail--waiting">{__("This will be visible in a few minutes.")}</div>
      ) : (
        <OptimizedImage
          // @ts-expect-error - TS2322 (ts-migration)
          alt={__("Channel profile picture")}
          className={!channelThumbnail ? "channel-thumbnail__default" : "channel-thumbnail__custom"}
          src={avatarSrc}
          loading={noLazyLoad ? undefined : "lazy"}
          onError={() => {
            setRetries((retries) => retries - 1);
            if (setThumbUploadError) {
              setThumbUploadError(true);
            } else {
              setThumbLoadError(true);
            }
          }}
          onLoad={() => {
            // Only a successful load of the real thumbnail clears the error.
            // The fallback avatar loading fine must not re-arm a broken URL,
            // or the image alternates between the two forever (#535).
            if (avatarSrc !== channelThumbnail) {
              return;
            }
            if (setThumbUploadError) {
              setThumbUploadError(false);
            } else {
              setThumbLoadError(false);
            }
          }}
        />
      )}
      {/* @ts-expect-error - TS2322 (ts-migration) */}
      {!hideStakedIndicator && <ChannelStakedIndicator uri={uri} claim={claim} />}
    </div>
  );
}

export default ChannelThumbnail;
