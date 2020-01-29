// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';

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

  return <div className={'embed__wrapper'}>{claim && <FileRender uri={uri} embedded />}</div>;
};

export default EmbedWrapperPage;
