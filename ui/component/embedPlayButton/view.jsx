// @flow
import React, { useEffect } from 'react';
import Button from 'component/button';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import { useHistory } from 'react-router-dom';
import useIsMobile from 'effects/use-is-mobile';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  uri: string,
  thumbnail: string,
  claim: ?Claim,
  doResolveUri: string => void,
  doFetchCostInfoForUri: string => void,
  doSetFloatingUri: string => void,
  floatingPlayerEnabled: boolean,
  doPlayUri: string => void,
};

export default function FileRenderFloating(props: Props) {
  const {
    uri,
    thumbnail = '',
    claim,
    doResolveUri,
    doFetchCostInfoForUri,
    doSetFloatingUri,
    floatingPlayerEnabled,
    doPlayUri,
  } = props;
  const { push } = useHistory();
  const isMobile = useIsMobile();
  const hasResolvedUri = claim !== undefined;

  useEffect(() => {
    if (!hasResolvedUri) {
      doResolveUri(uri);
      doFetchCostInfoForUri(uri);
    }
  }, [uri, hasResolvedUri, doResolveUri, doFetchCostInfoForUri]);

  function handleClick() {
    if (isMobile || !floatingPlayerEnabled) {
      const formattedUrl = formatLbryUrlForWeb(uri);
      push(formattedUrl);
    } else {
      doSetFloatingUri(uri);
      doPlayUri(uri);
    }
  }

  return (
    <div
      role="button"
      className="embed__inline-button"
      onClick={handleClick}
      style={{ backgroundImage: `url('${thumbnail.replace(/'/g, "\\'")}')` }}
    >
      <FileViewerEmbeddedTitle uri={uri} isInApp />
      <Button onClick={handleClick} iconSize={30} title={__('Play')} className={'button--icon button--play'} />
    </div>
  );
}
