// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';

type Props = {
  uri: string,
  resolveUri: string => void,
  claim: Claim,
  doPlayUri: string => void,
};
// $FlowFixMe apparently flow thinks this is wrong.
export const EmbedContext = React.createContext();
const EmbedWrapperPage = (props: Props) => {
  const { resolveUri, claim, uri, doPlayUri } = props;
  const haveClaim = Boolean(claim);

  useEffect(() => {
    if (resolveUri && uri && !haveClaim) {
      resolveUri(uri);
    }
    if (uri && haveClaim) {
      doPlayUri(uri);
    }
  }, [resolveUri, uri, doPlayUri, haveClaim]);

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
