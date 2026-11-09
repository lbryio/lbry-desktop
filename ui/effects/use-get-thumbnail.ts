import React from 'react';
import { generateStreamUrl } from 'util/web';

export default function useGetThumbnail(
  uri: string,
  claim: Claim | null | undefined,
  streamingUrl: string | null | undefined,
  getFile: (arg1: string) => void,
  shouldHide: boolean
) {
  let thumbnailToUse;

// @ts-expect-error - TS2339 - Property 'stream_type' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
  const isImage = claim && claim.value && claim.value.stream_type === 'image';
// @ts-expect-error - TS2339 - Property 'fee' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'. | TS2339 - Property 'fee' does not exist on type 'CollectionMetadata | StreamMetadata | ChannelMetadata'.
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
