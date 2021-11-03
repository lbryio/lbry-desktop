// @flow
import { THUMBNAIL_CDN_URL, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH, THUMBNAIL_QUALITY } from 'config';

type Props = {
  thumbnail: ?string,
  height?: number,
  width?: number,
  quality?: number,
};

export function getThumbnailCdnUrl(props: Props) {
  const { thumbnail, height = THUMBNAIL_HEIGHT, width = THUMBNAIL_WIDTH, quality = THUMBNAIL_QUALITY } = props;

  if (!THUMBNAIL_CDN_URL || !thumbnail) {
    return thumbnail;
  }

  if (thumbnail && !thumbnail.includes('https://spee.ch')) {
    return `${THUMBNAIL_CDN_URL}s:${width}:${height}/quality:${quality}/plain/${thumbnail}`;
  }

  if (thumbnail && thumbnail.includes('https://spee.ch') && !thumbnail.includes('?quality=')) {
    return `${thumbnail}?quality=${quality}&height=${height}&width=${width}`;
  }

  if (thumbnail && thumbnail.includes('https://spee.ch')) {
    return thumbnail;
  }
}
