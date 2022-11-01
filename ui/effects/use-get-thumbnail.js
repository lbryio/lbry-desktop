// @flow
import React from 'react';

export default function useGetThumbnail(
  uri: string,
  claim: ?Claim,
  streamingUrl: ?string,
  getFile: (string) => void,
  shouldHide: boolean
) {
  let thumbnailToUse;

  // $FlowFixMe
  const isImage = claim && claim.value && claim.value.stream_type === 'image';
  // $FlowFixMe
  const isFree = claim && claim.value && (!claim.value.fee || Number(claim.value.fee.amount) <= 0);
  const thumbnailInClaim = claim && claim.value && claim.value.thumbnail && claim.value.thumbnail.url;
  const repostSrcUri = claim && claim.repost_url && claim.canonical_url;
  let shouldFetchFileInfo = false;

  if (thumbnailInClaim) {
    thumbnailToUse = thumbnailInClaim;
  } else if (claim && isImage && isFree) {
    if (streamingUrl) {
      thumbnailToUse = streamingUrl;
    } else if (!shouldHide) {
      shouldFetchFileInfo = true;
    }
  } else {
    thumbnailToUse = null;
  }

  const [thumbnail, setThumbnail] = React.useState(thumbnailToUse);

  React.useEffect(() => {
    if (shouldFetchFileInfo) {
      getFile(repostSrcUri || uri);
    }
  }, [shouldFetchFileInfo, repostSrcUri, uri]);

  React.useEffect(() => {
    setThumbnail(thumbnailToUse);
  }, [thumbnailToUse]);

  return thumbnail;
}
