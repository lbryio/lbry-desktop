// @flow
import React from 'react';

type Props = {
  syncEnabled: boolean,
  verifiedEmail?: string,
  getSync: () => void,
};

function SyncBackgroundManager(props: Props) {
  const { syncEnabled, getSync, verifiedEmail } = props;

  React.useEffect(() => {
    if (syncEnabled && verifiedEmail) {
      getSync();
    }
  }, [syncEnabled, verifiedEmail, getSync]);

  return null;
}

export default SyncBackgroundManager;
