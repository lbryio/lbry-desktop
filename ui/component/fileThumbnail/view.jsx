// @flow
import type { Node } from 'react';
import {
  THUMBNAIL_WIDTH,
  THUMBNAIL_WIDTH_POSTER,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_HEIGHT_POSTER,
  THUMBNAIL_QUALITY,
  MISSING_THUMB_DEFAULT,
} from 'config';
import { useIsMobile } from 'effects/use-screensize';
import { getImageProxyUrl, getThumbnailCdnUrl } from 'util/thumbnail';
import React from 'react';
import FreezeframeWrapper from 'component/common/freezeframe-wrapper';
import classnames from 'classnames';
import Thumb from './internal/thumb';
import PreviewOverlayProtectedContent from '../previewOverlayProtectedContent';

const FALLBACK = MISSING_THUMB_DEFAULT ? getThumbnailCdnUrl({ thumbnail: MISSING_THUMB_DEFAULT }) : undefined;

type Props = {
  uri?: string,
  tileLayout?: boolean,
  thumbnail: ?string, // externally sourced image
  children?: Node,
  allowGifs: boolean,
  claim: ?StreamClaim,
  className?: string,
  small?: boolean,
  // -- redux --
  hasResolvedClaim: ?boolean, // undefined if uri is not given (irrelevant); boolean otherwise.
  thumbnailFromClaim: ?string,
  doResolveUri: (uri: string) => void,
};

function FileThumbnail(props: Props) {
  const {
    uri,
    tileLayout,
    thumbnail: rawThumbnail,
    children,
    allowGifs = false,
    className,
    small,
    // -- redux --
    hasResolvedClaim,
    thumbnailFromClaim,
    doResolveUri,
  } = props;

  const isMobile = useIsMobile();

  const passedThumbnail = rawThumbnail && rawThumbnail.trim().replace(/^http:\/\//i, 'https://');
  const thumbnail = passedThumbnail || thumbnailFromClaim;
  const isGif = thumbnail && thumbnail.endsWith('gif');

  React.useEffect(() => {
    if (hasResolvedClaim === false && uri && !passedThumbnail) {
      doResolveUri(uri);
    }
  }, [hasResolvedClaim, passedThumbnail, doResolveUri, uri]);

  if (!allowGifs && isGif) {
    const url = getImageProxyUrl(thumbnail);

    return (
      url && (
        <FreezeframeWrapper
          small={small}
          src={url}
          className={classnames('media__thumb', className, {
            'media__thumb--resolving': hasResolvedClaim === false,
            'media__thumb--small': small,
          })}
        >
          <PreviewOverlayProtectedContent uri={uri} />
          {children}
        </FreezeframeWrapper>
      )
    );
  }

  let url = thumbnail;
  // Pass image urls through a compression proxy
  if (thumbnail) {
    if (isGif) {
      url = getImageProxyUrl(thumbnail); // Note: the '!allowGifs' case is handled in Freezeframe above.
    } else {
      url = getThumbnailCdnUrl({
        thumbnail,
        width: isMobile && tileLayout ? THUMBNAIL_WIDTH_POSTER : THUMBNAIL_WIDTH,
        height: isMobile && tileLayout ? THUMBNAIL_HEIGHT_POSTER : THUMBNAIL_HEIGHT,
        quality: THUMBNAIL_QUALITY,
      });
    }
  }

  const thumbnailUrl = url && url.replace(/'/g, "\\'");

  if (thumbnailUrl !== undefined) {
    return (
      <Thumb small={small} thumb={thumbnailUrl} fallback={FALLBACK} className={className}>
        <PreviewOverlayProtectedContent uri={uri} />
        {children}
      </Thumb>
    );
  }

  return (
    <div
      className={classnames('media__thumb', className, {
        'media__thumb--resolving': hasResolvedClaim === false,
        'media__thumb--small': small,
      })}
    >
      {children}
    </div>
  );
}

export default FileThumbnail;
