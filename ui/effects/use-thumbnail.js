// @flow
import { getThumbnailCdnUrl } from 'util/thumbnail';
import React from 'react';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

export default function useThumbnail(claimThumbnail: ?string, containerRef: any) {
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);

  React.useEffect(() => {
    if (!claimThumbnail) return;

    const timer = setTimeout(() => {
      let newThumbnail = claimThumbnail;

      if (
        containerRef.current &&
        containerRef.current.parentElement &&
        containerRef.current.parentElement.offsetWidth
      ) {
        const w = containerRef.current.parentElement.offsetWidth;
        newThumbnail = getThumbnailCdnUrl({ thumbnail: newThumbnail, width: w, height: w });
      }

      if (newThumbnail !== thumbnail) {
        setThumbnail(newThumbnail);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [claimThumbnail, containerRef, thumbnail]);

  return thumbnail;
}
