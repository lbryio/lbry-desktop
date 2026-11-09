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
  viewBlobSpace: number,
  viewHostingLimit: number,
  disabled?: boolean,
  isSetting: boolean,
  // --- perform ---
  setDaemonSetting: (arg1: string, arg2?: SetDaemonSettingArg | null | undefined) => void,
  cleanBlobs: () => string,
  getDaemonStatus: () => void,
  diskSpace: DiskSpace
};

const TWENTY_PERCENT = 0.2;
const TEN_PERCENT = 0.1;
const MINIMUM_VIEW_SETTING = '0.01';

function SettingViewHosting(props: Props) {
  const {
    diskSpace,
    viewHostingLimit,
    viewBlobSpace,
    setDaemonSetting,
    cleanBlobs,
    getDaemonStatus,
    disabled,
    isSetting,
  } = props;

  // best effort to recommend a hosting amount default for the user
  const totalMB = diskSpace && Math.floor(diskSpace.total / 1024);
  const freeMB = diskSpace && Math.floor(diskSpace.free / 1024);
  const getGB = (val: unknown) => (Number(val) / 1024).toFixed(2);
  const recommendedSpace =
    freeMB > totalMB * TWENTY_PERCENT // plenty of space?
      ? Math.ceil(Number(getGB(totalMB * TEN_PERCENT))) // 10% of total
      : Math.ceil(Number(getGB(viewBlobSpace))); // current amount to avoid deleting
  // daemon settings come in as 'number', but we manage them as 'String'.
  const [contentBlobSpaceLimitGB, setContentBlobSpaceLimit] = React.useState(
    viewHostingLimit === 0 ? String(recommendedSpace) : String(viewHostingLimit / 1024)
  );

  const [unlimited, setUnlimited] = React.useState(viewHostingLimit === 0);

  function handleContentLimitChange(gb: unknown) {
    if (gb === '') {
      setContentBlobSpaceLimit('');
    } else if (gb === '0') {
      setContentBlobSpaceLimit(MINIMUM_VIEW_SETTING); // setting 0 means unlimited.
    } else {
      if (isTrulyANumber(Number(gb))) {
// @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'SetStateAction<string>'.
        setContentBlobSpaceLimit(gb);
      }
    }
  }

  function getContentLimitValue() {
    if (contentBlobSpaceLimitGB === '') {
      return '';
    } else if (Number(contentBlobSpaceLimitGB) <= Number(MINIMUM_VIEW_SETTING)) {
      return '0';
    } else {
      return contentBlobSpaceLimitGB;
    }
  }

  async function handleApply() {
    if (unlimited) {
      await setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, '0');
    } else {
      await setDaemonSetting(
        DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB,
        contentBlobSpaceLimitGB === MINIMUM_VIEW_SETTING ? '1' : convertGbToMbStr(contentBlobSpaceLimitGB)
      );
    }
    await cleanBlobs();
    getDaemonStatus();
  }

  function handleKeyDown(e: unknown) {
// @ts-expect-error - TS2339 - Property 'keyCode' does not exist on type 'unknown'.
    if (e.keyCode === KEYCODES.ESCAPE) {
// @ts-expect-error - TS2339 - Property 'preventDefault' does not exist on type 'unknown'.
      e.preventDefault();
      setContentBlobSpaceLimit(String(viewHostingLimit / 1024));
// @ts-expect-error - TS2339 - Property 'keyCode' does not exist on type 'unknown'.
    } else if (e.keyCode === KEYCODES.ENTER) {
// @ts-expect-error - TS2339 - Property 'preventDefault' does not exist on type 'unknown'.
      e.preventDefault();
      handleApply();
    }
  }

  React.useEffect(() => {
    // basically handle setUnlimited
    if (unlimited && viewHostingLimit !== 0) {
      handleApply();
    }
  }, [handleApply, unlimited, viewHostingLimit]);

  return (
    <>
      <div className={'fieldset-section'}>
        <FormField
          type="checkbox"
          name="hosting_limit"
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; checked: boolean; disabled: boolean; label: string; onChange: () => void; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          checked={unlimited}
          disabled={disabled || isSetting}
          label={__('Unlimited View Hosting')}
          onChange={() => setUnlimited(!unlimited)}
        />
        <FormField
          name="content_blob_limit_gb"
          type="number"
          min={0}
// @ts-expect-error - TS2322 - Type '{ name: string; type: string; min: number; onKeyDown: (e: unknown) => void; inputButton: Element; disabled: boolean; onWheel: (e: any) => any; label: string; onChange: (e: any) => void; value: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          onKeyDown={handleKeyDown}
          inputButton={
            <>
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                disabled={
                  // disabled if settings are equal or not valid amounts
                  (viewHostingLimit === 1 && contentBlobSpaceLimitGB <= MINIMUM_VIEW_SETTING) ||
                  (unlimited && viewHostingLimit === 0) ||
                  (!unlimited &&
                    (String(viewHostingLimit) === convertGbToMbStr(contentBlobSpaceLimitGB) ||
                      !isValidHostingAmount(String(contentBlobSpaceLimitGB)))) ||
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
                // @ts-expect-error - TS2322 (ts-migration)
                disabled={
                  // disabled if settings are equal or not valid amounts
                  (viewHostingLimit === 1 && contentBlobSpaceLimitGB <= MINIMUM_VIEW_SETTING) ||
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
          value={getContentLimitValue()}
        />
      </div>
    </>
  );
}

export default SettingViewHosting;
