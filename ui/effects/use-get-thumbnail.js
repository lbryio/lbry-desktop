// @flow
import React from 'react';
import { MISSING_THUMB_DEFAULT } from 'config';

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
  const isCollection = claim && claim.value_type === 'collection';
  const thumbnailInClaim = claim && claim.value && claim.value.thumbnail && claim.value.thumbnail.url;
  let shouldFetchFileInfo = false;

  if (thumbnailInClaim) {
    thumbnailToUse = thumbnailInClaim;
  } else if (claim && isImage && isFree) {
    if (streamingUrl) {
      thumbnailToUse = streamingUrl;
    } else if (!shouldHide) {
      shouldFetchFileInfo = true;
    }
  } else if (isCollection) {
    thumbnailToUse = MISSING_THUMB_DEFAULT;
  }

  const [thumbnail, setThumbnail] = React.useState(thumbnailToUse);

  React.useEffect(() => {
    if (shouldFetchFileInfo) {
      getFile(uri);
    }
  }, [shouldFetchFileInfo, uri]);

  React.useEffect(() => {
    setThumbnail(thumbnailToUse);
  }, [thumbnailToUse]);

  return thumbnail;
}
