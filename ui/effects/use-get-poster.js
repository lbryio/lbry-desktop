// @flow
import { getThumbnailCdnUrl } from 'util/thumbnail';
import React from 'react';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

export default function useGetPoster(claimThumbnail: ?string, containerRef: any) {
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);

  React.useEffect(() => {
    if (!claimThumbnail) {
      return setThumbnail(FileRenderPlaceholder);
    }

    const timer = setTimeout(() => {
      let newThumbnail = claimThumbnail;

      // generate the thumbnail url served by the cdn
      if (containerRef.current?.parentElement?.offsetWidth) {
        const w = containerRef.current.parentElement.offsetWidth;
        newThumbnail = getThumbnailCdnUrl({ thumbnail: newThumbnail, width: w, height: w });
      }

      // update new thumbnail in state
      if (newThumbnail !== thumbnail) {
        setThumbnail(newThumbnail);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [claimThumbnail, containerRef, thumbnail]);

  return thumbnail;
}
