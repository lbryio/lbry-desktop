// @flow

import React from 'react';
import Lbry from 'lbry';
import Button from 'component/button';
import Spinner from 'component/spinner';

type Props = {
  reflectingInfo?: ReflectingUpdate,
  checkReflecting: () => void,
};

const PublishPending = (props: Props) => {
  const { reflectingInfo = {}, checkReflecting } = props;
  const { fileListItem, progress, stalled } = reflectingInfo;
  const sdHash = fileListItem && fileListItem.sd_hash;
  const reflecting = Object.keys(reflectingInfo).length;
  if (stalled) {
    return (
      <Button
        button="link"
        label={__('Upload stalled. Retry?')}
        onClick={() => Lbry.file_reflect({ sd_hash: sdHash }).then(() => checkReflecting())}
      />
    );
  } else if (reflecting) {
    return <span>{__('Uploading (%progress%%) ', { progress: progress })}</span>;
  } else {
    return (
      <div className="confirming-change">
        {__('Confirming...')} <Spinner type="small" />
      </div>
    );
  }
};

export default PublishPending;
