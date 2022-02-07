// @flow
import React from 'react';
import { getThumbnailCdnUrl } from 'util/thumbnail';

function scaleToDevicePixelRatio(value: number, window: any) {
  const devicePixelRatio = window.devicePixelRatio || 1.0;
  return Math.ceil(value * devicePixelRatio);
}

type Props = {
  src: string,
  objectFit?: string,
  waitLoad?: boolean,
};

function OptimizedImage(props: Props) {
  const { objectFit, src, waitLoad, ...imgProps } = props;
  const [optimizedSrc, setOptimizedSrc] = React.useState('');
  const ref = React.useRef<any>();

  function getOptimizedImgUrl(url, width, height) {
    let optimizedUrl = url;
    if (url && !url.startsWith('/public/')) {
      optimizedUrl = url.trim().replace(/^http:\/\//i, 'https://');

      // @if TARGET='web'
      if (!optimizedUrl.endsWith('.gif')) {
        optimizedUrl = getThumbnailCdnUrl({ thumbnail: optimizedUrl, width, height, quality: 85 });
      }
      // @endif
    }
    return optimizedUrl;
  }

  function getOptimumSize(elem) {
    if (!elem || !elem.parentElement || !elem.parentElement.clientWidth || !elem.parentElement.clientHeight) {
      return null;
    }

    let width = elem.parentElement.clientWidth;
    let height = elem.parentElement.clientHeight;

    width = scaleToDevicePixelRatio(width, window);
    height = scaleToDevicePixelRatio(height, window);

    // Round to next 100px for better caching
    width = Math.ceil(width / 100) * 100;
    height = Math.ceil(height / 100) * 100;

    // Reminder: CDN expects integers.
    return { width, height };
  }

  function adjustOptimizationIfNeeded(elem, objectFit, origSrc) {
    if (objectFit === 'cover' && elem) {
      const containerSize = getOptimumSize(elem);
      if (containerSize) {
        // $FlowFixMe
        if (elem.naturalWidth < containerSize.width) {
          // For 'cover', we don't want to stretch the image. We started off by
          // filling up the container height, but the width still has a gap for
          // this instance (usually due to aspect ratio mismatch).
          // If the original image is much larger, we can request for a larger
          // image so that "objectFit=cover" will center it without stretching and
          // making it blur. The double fetch might seem wasteful, but on
          // average the total transferred bytes is still less than the original.
          const probablyMaxedOut = elem.naturalHeight < containerSize.height;
          if (!probablyMaxedOut) {
            const newOptimizedSrc = getOptimizedImgUrl(origSrc, containerSize.width, 0);
            if (newOptimizedSrc && newOptimizedSrc !== optimizedSrc) {
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
        setOptimizedSrc(newOptimizedSrc);
      }
    } else {
      setOptimizedSrc(src);
    }
    // We only want to run this on (1) initial mount and (2) 'src' change. Nothing else.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (!src || !optimizedSrc) {
    return null;
  }

  return (
    <img
      ref={ref}
      {...imgProps}
      style={{ visibility: waitLoad ? 'hidden' : 'visible' }}
      src={optimizedSrc}
      onLoad={() => {
        if (waitLoad) ref.current.style.visibility = 'visible';
        adjustOptimizationIfNeeded(ref.current, objectFit, src);
      }}
    />
  );
}

export default OptimizedImage;
