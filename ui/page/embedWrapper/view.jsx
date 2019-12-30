// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';
import Spinner from 'component/spinner';

type Props = {
  uri: string,
  resolveUri: string => void,
  claim: Claim,
  streamUrl: string,
};
const EmbedWrapperPage = (props: Props) => {
  const { resolveUri, claim, uri, streamUrl } = props;
  useEffect(() => {
    if (resolveUri && uri) {
      resolveUri(uri);
    }
  }, []);

  if (uri && claim) {
    return (
      <div className={'embed__wrapper'}>
        <FileRender uri={uri} embedUrl={streamUrl} />
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default EmbedWrapperPage;
