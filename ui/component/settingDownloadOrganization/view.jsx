// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import SettingsRow from 'component/settingsRow';
import * as SETTINGS from 'constants/settings';
import { DOWNLOAD_NAMING } from 'util/download-target';
import type { DownloadNaming } from 'util/download-target';

type Props = {
  byChannel: boolean,
  fileNaming: DownloadNaming,
  setClientSetting: (key: string, value: boolean | string) => void,
};

export default function SettingDownloadOrganization(props: Props) {
  const { byChannel, fileNaming, setClientSetting } = props;

  return (
    <>
      <SettingsRow
        title={__('Organize downloads by channel')}
        subtitle={__(
          'Save each download into a folder named after its channel, inside your download directory. Content without a channel goes into an "Anonymous" folder.'
        )}
      >
        <FormField
          type="checkbox"
          name="download_by_channel"
          onChange={() => setClientSetting(SETTINGS.DOWNLOAD_BY_CHANNEL, !byChannel)}
          checked={byChannel}
        />
      </SettingsRow>

      <SettingsRow
        title={__('Name downloaded files')}
        subtitle={__(
          "Keep the uploader's file name, or name files after their title. Files with the same name get a number added. Changing these settings will not affect previously downloaded content."
        )}
      >
        <fieldset-section>
          <FormField
            name="download_file_naming"
            type="select"
            onChange={(e) => setClientSetting(SETTINGS.DOWNLOAD_FILE_NAMING, e.target.value)}
            value={fileNaming}
          >
            <option value={DOWNLOAD_NAMING.ORIGINAL}>{__('Original file name')}</option>
            <option value={DOWNLOAD_NAMING.TITLE}>{__('Title')}</option>
            <option value={DOWNLOAD_NAMING.DATE_TITLE}>{__('Date - Title')}</option>
          </FormField>
        </fieldset-section>
      </SettingsRow>
    </>
  );
}
