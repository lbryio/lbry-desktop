import React from 'react';
import Yrbl from 'component/yrbl';

type Props = {
  source: string,
  claim: StreamClaim,
  contentType: string
};

function AppViewer(props: Props) {
  return (
    <div className="content__cover--none">
      <Yrbl
        title={__('Sorry')}
        subtitle={__('Games and apps are currently disabled due to potential security concerns.')}
      />
    </div>
  );
}

export default AppViewer;
