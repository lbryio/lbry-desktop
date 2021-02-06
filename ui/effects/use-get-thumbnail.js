// @flow
import React from 'react';
import { generateStreamUrl } from 'util/web';

export default function useGetThumbnail(
  uri: string,
  claim: ?Claim,
  streamingUrl: ?string,
  getFile: string => void,
  shouldHide: boolean
) {
  let thumbnailToUse;

  // $FlowFixMe
  const isImage = claim && claim.value && claim.value.stream_type === 'image';
  // $FlowFixMe
  const isFree = claim && claim.value && (!claim.value.fee || Number(claim.value.fee.amount) <= 0);
  const isCollection = claim && claim.value_type === 'collection';
  const thumbnailInClaim = claim && claim.value && claim.value.thumbnail && claim.value.thumbnail.url;

  // @if TARGET='web'
  if (thumbnailInClaim) {
    thumbnailToUse = thumbnailInClaim;
  } else if (claim && isImage && isFree) {
    thumbnailToUse = generateStreamUrl(claim.name, claim.claim_id);
  } else if (isCollection) {
    thumbnailToUse = 'http://spee.ch/default-thumb-odysee:e.jpg';
  }
  // @endif

  // @if TARGET='app'
  thumbnailToUse = thumbnailInClaim;

  //
  // Temporarily disabled until we can call get with "save_blobs: off"
  //
  // React.useEffect(() => {
  //   if (hasClaim && isImage && isFree) {
  //     if (streamingUrl) {
  //       setThumbnail(streamingUrl);
  //     } else if (!shouldHide) {
  //       getFile(uri);
  //     }
  //   }
  // }, [hasClaim, isFree, isImage, streamingUrl, uri, shouldHide]);
  // @endif

  const [thumbnail, setThumbnail] = React.useState(thumbnailToUse);
  React.useEffect(() => {
    setThumbnail(thumbnailToUse);
  }, [thumbnailToUse]);

  return thumbnail;
}
