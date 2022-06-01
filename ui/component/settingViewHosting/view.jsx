// @flow

import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import { isTrulyANumber } from 'util/number';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import { convertGbToMbStr, isValidHostingAmount } from 'util/hosting';

type SetDaemonSettingArg = boolean | string | number;

type Props = {
  // --- select ---
  viewHostingLimit: number,
  disabled?: boolean,
  isSetting: boolean,
  // --- perform ---
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  cleanBlobs: () => string,
  getDaemonStatus: () => void,
};

function SettingViewHosting(props: Props) {
  const { viewHostingLimit, setDaemonSetting, cleanBlobs, getDaemonStatus, disabled, isSetting } = props;

  // daemon settings come in as 'number', but we manage them as 'String'.
  const [contentBlobSpaceLimitGB, setContentBlobSpaceLimit] = React.useState(
    viewHostingLimit === 0 ? '0.01' : String(viewHostingLimit / 1024)
  );

  const [unlimited, setUnlimited] = React.useState(viewHostingLimit === 0);

  function handleContentLimitChange(gb) {
    if (gb === '') {
      setContentBlobSpaceLimit('');
    } else if (gb === '0') {
      setContentBlobSpaceLimit('0.01'); // setting 0 means unlimited.
    } else {
      if (isTrulyANumber(Number(gb))) {
        setContentBlobSpaceLimit(gb);
      }
    }
  }

  async function handleApply() {
    if (unlimited) {
      await setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, '0');
    } else {
      await setDaemonSetting(
        DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB,
        String(contentBlobSpaceLimitGB === '0.01' ? '1' : convertGbToMbStr(contentBlobSpaceLimitGB))
      );
    }
    await cleanBlobs();
    getDaemonStatus();
  }

  function handleKeyDown(e) {
    if (e.keyCode === KEYCODES.ESCAPE) {
      e.preventDefault();
      setContentBlobSpaceLimit(String(viewHostingLimit / 1024));
    } else if (e.keyCode === KEYCODES.ENTER) {
      e.preventDefault();
      handleApply();
    }
  }

  React.useEffect(() => {
    if (unlimited) {
      handleApply();
    }
  }, [unlimited]);

  return (
    <>
      <div className={'fieldset-section'}>
        <FormField
          type="checkbox"
          name="hosting_limit"
          checked={unlimited}
          disabled={disabled || isSetting}
          label={__('Unlimited View Hosting')}
          onChange={() => setUnlimited(!unlimited)}
        />
        <FormField
          name="content_blob_limit_gb"
          type="number"
          min={0}
          onKeyDown={handleKeyDown}
          inputButton={
            <>
              <Button
                disabled={
                  // disabled if settings are equal or not valid amounts
                  (viewHostingLimit === 1 && contentBlobSpaceLimitGB === '0') ||
                  (unlimited && viewHostingLimit === 0) ||
                  (!unlimited &&
                    String(viewHostingLimit) ===
                      convertGbToMbStr(
                        contentBlobSpaceLimitGB || !isValidHostingAmount(String(contentBlobSpaceLimitGB))
                      )) ||
                  isSetting ||
                  disabled
                }
                type="button"
                button="alt"
                onClick={handleApply}
                aria-label={__('Apply')}
                icon={ICONS.COMPLETE}
              />
              <Button
                disabled={
                  // disabled if settings are equal or not valid amounts
                  (viewHostingLimit === 1 && contentBlobSpaceLimitGB === '0') ||
                  (unlimited && viewHostingLimit === 0) ||
                  (!unlimited &&
                    (String(viewHostingLimit) === convertGbToMbStr(contentBlobSpaceLimitGB) ||
                      !isValidHostingAmount(String(contentBlobSpaceLimitGB)))) ||
                  isSetting ||
                  disabled
                }
                type="button"
                button="alt"
                onClick={() => setContentBlobSpaceLimit(String(viewHostingLimit / 1024))}
                aria-label={__('Reset')}
                icon={ICONS.REMOVE}
              />
            </>
          }
          disabled={isSetting || disabled || unlimited}
          onWheel={(e) => e.preventDefault()}
          label={__(`View Hosting Limit (GB)`)}
          onChange={(e) => handleContentLimitChange(e.target.value)}
          value={Number(contentBlobSpaceLimitGB) <= Number('0.01') ? '0' : contentBlobSpaceLimitGB}
        />
      </div>
    </>
  );
}

export default SettingViewHosting;
