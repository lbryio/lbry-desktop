// @flow
import React from 'react';
import { generateStreamUrl } from 'util/lbrytv';

export default function useGetThumbnail(
  uri: string,
  claim: ?Claim,
  streamingUrl: ?string,
  getFile: string => void,
  shouldHide: boolean
) {
  const hasClaim = claim !== undefined;

  // $FlowFixMe
  const isImage = claim && claim.value && claim.value.stream_type === 'image';
  // $FlowFixMe
  const isFree = claim && claim.value && (!claim.value.fee || Number(claim.value.fee.amount) <= 0);
  let thumbnailToUse;

  // @if TARGET='web'
  if (claim && isImage && isFree) {
    thumbnailToUse = generateStreamUrl(claim.name, claim.claim_id, 'https://api.lbry.tv');
  }
  // @endif

  const [thumbnail, setThumbnail] = React.useState(thumbnailToUse);
  React.useEffect(() => {
    setThumbnail(thumbnailToUse);
  }, [thumbnailToUse]);

  // @if TARGET='app'
  React.useEffect(() => {
    if (hasClaim && isImage && isFree) {
      if (streamingUrl) {
        setThumbnail(streamingUrl);
      } else if (!shouldHide) {
        getFile(uri);
      }
    }
  }, [hasClaim, isFree, isImage, streamingUrl, uri, shouldHide]);
  // @endif

  return thumbnail;
}
