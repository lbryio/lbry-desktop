// @flow
import React, { useEffect } from 'react';
import FileRender from 'component/fileRender';

type Props = {
  uri: string,
  resolveUri: string => void,
  claim: Claim,
  doPlayUri: string => void,
  costInfo: any,
  streamingUrl: string,
  doFetchCostInfoForUri: string => void,
  isResolvingUri: boolean,
};
// $FlowFixMe apparently flow thinks this is wrong.
export const EmbedContext = React.createContext();
const EmbedWrapperPage = (props: Props) => {
  const { resolveUri, claim, uri, doPlayUri, costInfo, streamingUrl, doFetchCostInfoForUri, isResolvingUri } = props;
  const haveClaim = Boolean(claim);

  useEffect(() => {
    if (resolveUri && uri && !haveClaim) {
      resolveUri(uri);
    }
    if (uri && haveClaim && costInfo && costInfo.cost === 0) {
      doPlayUri(uri);
    }
  }, [resolveUri, uri, doPlayUri, haveClaim, costInfo]);

  useEffect(() => {
    if (haveClaim && uri && doFetchCostInfoForUri) {
      doFetchCostInfoForUri(uri);
    }
  }, [uri, haveClaim, doFetchCostInfoForUri]);

  return (
    <div className={'embed__wrapper'}>
      <EmbedContext.Provider value>
        {claim && streamingUrl && <FileRender uri={uri} embedded />}
        {!claim && isResolvingUri && <h1>Loading...</h1>}
        {!claim && !isResolvingUri && <h1>No content at this link.</h1>}
        {claim && costInfo && costInfo.cost > 0 && <h1>Paid content cannot be embedded.</h1>}
      </EmbedContext.Provider>
    </div>
  );
};

export default EmbedWrapperPage;
