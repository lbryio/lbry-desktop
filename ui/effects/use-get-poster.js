// @flow
import React from 'react';
import { THUMBNAIL_WIDTH_POSTER, THUMBNAIL_HEIGHT_POSTER } from 'config';
import { getThumbnailCdnUrl } from 'util/thumbnail';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

export default function useGetPoster(claimThumbnail: ?string) {
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);

  React.useEffect(() => {
    if (!claimThumbnail) {
      setThumbnail(FileRenderPlaceholder);
    } else {
      setThumbnail(
        getThumbnailCdnUrl({
          thumbnail: claimThumbnail,
          width: THUMBNAIL_WIDTH_POSTER,
          height: THUMBNAIL_HEIGHT_POSTER,
        })
      );
    }
  }, [claimThumbnail]);

  return thumbnail;
}
