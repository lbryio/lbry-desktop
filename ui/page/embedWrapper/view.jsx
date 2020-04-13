// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';

type Props = {
  uri: string,
  resolveUri: string => void,
  claim: Claim,
};
// $FlowFixMe apparently flow thinks this is wrong.
export const EmbedContext = React.createContext();
const EmbedWrapperPage = (props: Props) => {
  const { resolveUri, claim, uri } = props;

  useEffect(() => {
    if (resolveUri && uri) {
      resolveUri(uri);
    }
  }, [resolveUri, uri]);

  return (
    <div className={'embed__wrapper'}>
      {claim && (
        <EmbedContext.Provider value>
          <FileRender uri={uri} embedded />
        </EmbedContext.Provider>
      )}
    </div>
  );
};

export default EmbedWrapperPage;
