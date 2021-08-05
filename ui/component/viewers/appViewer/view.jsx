// @flow
import React from 'react';
import Yrbl from 'component/yrbl';
// import LoadingScreen from 'component/common/loading-screen';

type Props = {
  source: string,
  claim: StreamClaim,
  contentType: string,
};

// const SANDBOX_TYPES = ['application/x-lbry', 'application/x-ext-lbry'];

// This server exists in src/platforms/electron/startSandBox.js
// const SANDBOX_SET_BASE_URL = 'http://localhost:5278/set/';
// const SANDBOX_CONTENT_BASE_URL = 'http://localhost:5278';

function AppViewer(props: Props) {
  // const { claim, contentType } = props;
  // const [loading, setLoading] = useState(true);
  // const [appUrl, setAppUrl] = useState(false);

  // const outpoint = `${claim.txid}:${claim.nout}`;
  // useEffect(() => {
  //   if (SANDBOX_TYPES.indexOf(contentType) > -1) {
  //     fetch(`${SANDBOX_SET_BASE_URL}${outpoint}`)
  //       .then(res => res.text())
  //       .then(url => {
  //         const appUrl = `${SANDBOX_CONTENT_BASE_URL}${url}`;
  //         setAppUrl(appUrl);
  //         setLoading(false);
  //       })
  //       .catch(err => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false);
  //   }
  // }, [outpoint, contentType, setAppUrl, setLoading]);

  return (
    <div className="content__cover--none">
      <Yrbl
        title={__('Sorry')}
        subtitle={__('Games and apps are currently disabled due to potential security concerns.')}
      />
    </div>
  );

  // return (
  //   <div className="file-viewer">
  //     {!appUrl && (
  //       <LoadingScreen
  //         status={loading ? __('Almost there') : __('Unable to view this file in the app')}
  //         spinner={loading}
  //       />
  //     )}
  //      {appUrl && (
  //       <webview
  //         title=""
  //         sandbox="allow-scripts allow-forms allow-pointer-lock"
  //         src={appUrl}
  //         autosize="on"
  //         style={{ border: 0, width: '100%', height: '100%' }}
  //         useragent="Mozilla/5.0 AppleWebKit/537 Chrome/60 Safari/537"
  //         enableremotemodule="false"
  //         webpreferences="sandbox=true,contextIsolation=true,webviewTag=false,enableRemoteModule=false,devTools=false"
  //       />
  //     )}
  //   </div>
  // );
}

export default AppViewer;
