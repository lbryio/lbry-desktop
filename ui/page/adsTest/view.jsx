// @flow
// import React from 'react';
// import FilePage from 'page/file';

type Props = {
  doResolveUri: (string) => void,
  claim: ?StreamClaim,
};

export default function AdsTestPage(props: Props) {
  return null;
  //   const { doResolveUri, claim } = props;
  //   const hasClaim = claim !== undefined;
  //   React.useEffect(() => {
  //     if (!hasClaim) {
  //       doResolveUri('lbry://fullscreenrelease#7');
  //     }
  //   }, [hasClaim, doResolveUri]);
  //   return <div>{hasClaim && <FilePage uri="lbry://fullscreenrelease#7" />}</div>;
}
