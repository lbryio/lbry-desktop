// @Flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Yrbl from 'component/yrbl';

export default function SyncFatalError() {
  return (
    <div className="main--empty">
      <Yrbl
        title={__('There is a bug... somewhere')}
        subtitle={
          <p>{__("Try refreshing to fix the issue. If that doesn't work, email help@odysee.com for support.")}</p>
        }
        actions={
          <div className="section__actions">
            <Button
              button="primary"
              icon={ICONS.REFRESH}
              label={__('Refresh')}
              onClick={() => window.location.reload()}
            />
          </div>
        }
      />
    </div>
  );
}
