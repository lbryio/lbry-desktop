// @flow
import { SETTINGS_GRP } from 'constants/settings';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import SettingDataHosting from 'component/settingDataHosting';
import SettingViewHosting from 'component/settingViewHosting';
import SettingSaveBlobs from 'component/settingSaveBlobs';
import SettingsRow from 'component/settingsRow';
import AppStorageViz from 'component/appStorageVisualization';
import Spinner from 'component/spinner';
import classnames from 'classnames';

type DaemonSettings = {
  save_blobs: boolean,
};

type Props = {
  daemonSettings: DaemonSettings,
  isSetting: boolean,
  isWelcome?: boolean,
  cleanBlobs: () => Promise<any>,
};

export default function SettingStorage(props: Props) {
  const { daemonSettings, isSetting, isWelcome, cleanBlobs } = props;

  const saveBlobs = daemonSettings && daemonSettings.save_blobs;
  const [isCleaning, setCleaning] = React.useState(false);

  // currently, it seems, blob space statistics are only updated during clean
  React.useEffect(() => {
    setCleaning(true);
    cleanBlobs().then(() => {
      setCleaning(false);
    });
  }, [cleanBlobs]);

  return (
    <>
      <div className="card__title-section">
        <h2 className={classnames('card__title', { 'section__title--large': isWelcome })}>
          {isWelcome ? __('Custom Hosting') : __('Hosting')}
          {(isSetting || isCleaning) && <Spinner type={'small'} />}
        </h2>
      </div>
      <Card
        id={SETTINGS_GRP.STORAGE}
        isBodyList
        body={
          <>
            <SettingsRow
              title={__('Enable Data Hosting')}
              subtitle={
                <React.Fragment>
                  {__('Help improve the P2P data network (and make LBRY users happy) by hosting data.')}
                </React.Fragment>
              }
              footer={<AppStorageViz />}
            >
              <SettingSaveBlobs />
            </SettingsRow>
            <SettingsRow
              title={__('Viewed Hosting')}
              multirow
              disabled={!saveBlobs}
              subtitle={
                <React.Fragment>
                  {__("View History Hosting lets you choose how much storage to use hosting content you've consumed.")}{' '}
                  <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/host-content" />
                </React.Fragment>
              }
            >
              <SettingViewHosting disabled={!saveBlobs} />
            </SettingsRow>
            <SettingsRow
              title={__('Auto Hosting')}
              multirow
              disabled={!saveBlobs}
              subtitle={
                <React.Fragment>
                  {__('Automatic Hosting downloads a small portion of content active on the network.')}{' '}
                  <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/host-content" />
                </React.Fragment>
              }
            >
              <SettingDataHosting />
            </SettingsRow>
          </>
        }
      />
    </>
  );
}
