// @flow
import React, { useEffect } from 'react';
import classnames from 'classnames';
import FileRender from 'component/fileRender';
import FileViewerEmbeddedTitle from 'component/fileViewerEmbeddedTitle';
import Spinner from 'component/spinner';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import { useHistory } from 'react-router';

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
  const {
    location: { search },
  } = useHistory();
  const urlParams = new URLSearchParams(search);
  const embedLightBackground = urlParams.get('embedBackgroundLight');
  const haveClaim = Boolean(claim);
  const readyToDisplay = claim && streamingUrl;
  const loading = !claim && isResolvingUri;
  const noContentFound = !claim && !isResolvingUri;
  const isPaidContent = costInfo && costInfo.cost > 0;
  const contentLink = formatLbryUrlForWeb(uri);

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
    <div
      className={classnames('embed__wrapper', {
        'embed__wrapper--light-background': embedLightBackground,
      })}
    >
      <EmbedContext.Provider value>
        {readyToDisplay ? (
          <FileRender uri={uri} embedded />
        ) : (
          <div className="embed__loading">
            <FileViewerEmbeddedTitle uri={uri} />

            <div className="embed__loading-text">
              {loading && <Spinner delayed light />}
              {noContentFound && <h1>{__('No content found.')}</h1>}
              {isPaidContent && (
                <div>
                  <h1>{__('Paid content cannot be embedded.')}</h1>
                  <div className="section__actions--centered">
                    <Button label={__('Watch on lbry.tv')} button="primary" href={contentLink} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </EmbedContext.Provider>
    </div>
  );
};

export default EmbedWrapperPage;
