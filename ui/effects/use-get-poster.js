// @flow
import { getThumbnailCdnUrl } from 'util/thumbnail';
import React from 'react';
// $FlowFixMe cannot resolve ...
import FileRenderPlaceholder from 'static/img/fileRenderPlaceholder.png';

export default function useGetPoster(claimThumbnail: ?string) {
  const [thumbnail, setThumbnail] = React.useState(FileRenderPlaceholder);

  React.useEffect(() => {
    if (!claimThumbnail) {
      setThumbnail(FileRenderPlaceholder);
    } else {
      setThumbnail(getThumbnailCdnUrl({ thumbnail: claimThumbnail, width: 1280, height: 720 }));
    }
  }, [claimThumbnail]);

  return thumbnail;
}
