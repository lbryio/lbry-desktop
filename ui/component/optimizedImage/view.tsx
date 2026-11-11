import React from "react";
import { getThumbnailCdnUrl } from "util/thumbnail";

function scaleToDevicePixelRatio(value: number, window: any) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  src: string;
  objectFit?: string;
  waitLoad?: boolean;
  onLoad?: () => void;
};

function OptimizedImage(props: Props) {
  const { objectFit, src, waitLoad, ...imgProps } = props;
  const [optimizedSrc, setOptimizedSrc] = React.useState("");
  const ref = React.useRef<any>();

  function getOptimizedImgUrl(url: unknown, width: unknown, height: unknown) {
    let optimizedUrl = url;
    // @ts-expect-error - TS2339 - Property 'startsWith' does not exist on type 'unknown'.
    if (url && !url.startsWith("/public/")) {
      // @ts-expect-error - TS2339 - Property 'trim' does not exist on type 'unknown'.
      optimizedUrl = url.trim().replace(/^http:\/\//i, "https://");

      // @if TARGET='web'
      // @ts-expect-error - TS2339 - Property 'endsWith' does not exist on type 'unknown'.
      if (!optimizedUrl.endsWith(".gif")) {
        // @ts-expect-error - TS2322 - Type 'unknown' is not assignable to type 'string'. | TS2322 - Type 'unknown' is not assignable to type 'number'. | TS2322 - Type 'unknown' is not assignable to type 'number'.
        optimizedUrl = getThumbnailCdnUrl({ thumbnail: optimizedUrl, width, height, quality: 85 });
      }
      // @endif
    }
    return optimizedUrl;
  }

  function getOptimumSize(elem: unknown) {
    // @ts-expect-error - TS2339 - Property 'parentElement' does not exist on type 'unknown'. | TS2339 - Property 'parentElement' does not exist on type 'unknown'. | TS2339 - Property 'parentElement' does not exist on type 'unknown'.
    if (!elem || !elem.parentElement || !elem.parentElement.clientWidth || !elem.parentElement.clientHeight) {
      return null;
    }

    // @ts-expect-error - TS2339 - Property 'parentElement' does not exist on type 'unknown'.
    let width = elem.parentElement.clientWidth;
    // @ts-expect-error - TS2339 - Property 'parentElement' does not exist on type 'unknown'.
    let height = elem.parentElement.clientHeight;

    width = scaleToDevicePixelRatio(width, window);
    height = scaleToDevicePixelRatio(height, window);

    // Round to next 100px for better caching
    width = Math.ceil(width / 100) * 100;
    height = Math.ceil(height / 100) * 100;

    // Reminder: CDN expects integers.
    return { width, height };
  }

  function adjustOptimizationIfNeeded(elem: unknown, objectFit: unknown, origSrc: unknown) {
    if (objectFit === "cover" && elem) {
      const containerSize = getOptimumSize(elem);
      if (containerSize) {
        // @ts-expect-error - TS2339 - Property 'naturalWidth' does not exist on type 'unknown'.
        if (elem.naturalWidth < containerSize.width) {
          // For 'cover', we don't want to stretch the image. We started off by
          // filling up the container height, but the width still has a gap for
          // this instance (usually due to aspect ratio mismatch).
          // If the original image is much larger, we can request for a larger
          // image so that "objectFit=cover" will center it without stretching and
          // making it blur. The double fetch might seem wasteful, but on
          // average the total transferred bytes is still less than the original.
          // @ts-expect-error - TS2339 - Property 'naturalHeight' does not exist on type 'unknown'.
          const probablyMaxedOut = elem.naturalHeight < containerSize.height;
          if (!probablyMaxedOut) {
            const newOptimizedSrc = getOptimizedImgUrl(origSrc, containerSize.width, 0);
            if (newOptimizedSrc && newOptimizedSrc !== optimizedSrc) {
              // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'SetStateAction<string>'.
              setOptimizedSrc(newOptimizedSrc);
            }
          }
        }
      }
    }
  }

  React.useEffect(() => {
    const containerSize = getOptimumSize(ref.current);
    if (containerSize) {
      const width = 0; // The CDN will fill the zeroed attribute per image's aspect ratio.
      const height = containerSize.height;

      const newOptimizedSrc = getOptimizedImgUrl(src, width, height);

      if (newOptimizedSrc !== optimizedSrc) {
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'SetStateAction<string>'.
        setOptimizedSrc(newOptimizedSrc);
      }
    } else {
      setOptimizedSrc(src);
    }
    // We only want to run this on (1) initial mount and (2) 'src' change. Nothing else.
  }, [src]);

  if (!src) {
    return null;
  }

  return (
    <img
      ref={ref}
      {...imgProps}
      style={{ visibility: waitLoad ? "hidden" : "visible" }}
      src={optimizedSrc}
      onLoad={() => {
        if (waitLoad) ref.current.style.visibility = "visible";
        adjustOptimizationIfNeeded(ref.current, objectFit, src);
        if (imgProps.onLoad) imgProps.onLoad();
      }}
    />
  );
}

export default OptimizedImage;
