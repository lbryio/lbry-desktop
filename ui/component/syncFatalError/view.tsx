import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import { SITE_HELP_EMAIL } from 'config';

type Props = Record<any, any>;

export default function SyncFatalError(props: Props) {
  let downTime = false;

  return (
    <div className="main--empty">
      <Yrbl
        title={downTime ? __('Under maintenance...') : __('There is a bug... somewhere')}
        subtitle={
          <p>
            {downTime
              ? __("We're currently upgrading or rebooting our services, please try refreshing in a few minutes.")
              : __("Try refreshing to fix the issue. If that doesn't work, email %SITE_HELP_EMAIL% for support.", {
                  SITE_HELP_EMAIL,
                })}
          </p>
        }
        actions={
          <div className="section__actions">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
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
