// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';
import Spinner from 'component/spinner';

type Props = {
  uri: string,
  resolveUri: string => void,
  claim: Claim,
};
const EmbedWrapperPage = (props: Props) => {
  const { resolveUri, claim, uri } = props;
  useEffect(() => {
    if (resolveUri && uri) {
      resolveUri(uri);
    }
  }, []);

  if (uri && claim) {
    return (
      <div className={'embed__wrapper'}>
        <FileRender uri={uri} embedded />
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default EmbedWrapperPage;
