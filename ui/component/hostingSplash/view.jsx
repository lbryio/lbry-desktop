// @flow
import React from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form-components/form-field';
import { Form } from 'component/common/form-components/form';
import { withRouter } from 'react-router-dom';

// $FlowFixMe cannot resolve ...
import image from 'static/img/yrblhappy.svg';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';

type SetDaemonSettingArg = boolean | string | number;

type Props = {
  handleNextPage: () => void,
  handleDone: () => void,
  setDaemonSetting: (string, ?SetDaemonSettingArg) => void,
  // --- select ---
  diskSpace: DiskSpace, // KB
  viewHostingLimit: number, // MB
  autoHostingLimit: number,
  viewBlobSpace: number,
  autoBlobSpace: number,
  privateBlobSpace: number,
  saveBlobs: boolean,
};

function HostingSplash(props: Props) {
  const {
    handleNextPage,
    diskSpace,
    viewHostingLimit,
    autoHostingLimit,
    viewBlobSpace,
    autoBlobSpace,
    saveBlobs,
    setDaemonSetting,
    handleDone,
  } = props;

  const totalMB = diskSpace && Math.floor(Number(diskSpace.total) / 1024);
  const freeMB = diskSpace && Math.floor(Number(diskSpace.free) / 1024);
  const blobSpaceUsed = viewBlobSpace + autoBlobSpace;

  const [hostingChoice, setHostingChoice] = React.useState('MANAGED');
  function handleSubmit() {
    if (hostingChoice === 'CUSTOM') {
      handleNextPage();
    } else {
      handleAuto();
    }
  }

  function getManagedLimitMB() {
    const value =
      freeMB > totalMB * 0.2 // lots of free space?
        ? blobSpaceUsed > totalMB * 0.1 // using more than 10%?
          ? (freeMB + blobSpaceUsed) / 2 // e.g. 40g used plus 30g free, knock back to 35g limit, freeing to 35g
          : totalMB * 0.1 // let it go up to 10%
        : (freeMB + blobSpaceUsed) / 2; // e.g. 40g used plus 10g free, knock back to 25g limit, freeing to 25g
    return value > 10240 ? Math.floor(value / 1024) * 1024 : 0;
  }

  function getAutoLimit() {
    // return floor of 10% of total
    const totalGB = Math.floor(getManagedLimitMB() / 1024); // eg, 25GB
    return Math.floor(totalGB / 10) * 1024; // eg, 2 GB -> 2048MB
  }

  function getViewedLimit() {
    return getManagedLimitMB() - getAutoLimit();
  }

  function getManagedCopy() {
    if (viewHostingLimit || autoHostingLimit || !saveBlobs) {
      return __("I'm happy with my settings");
    } else if (getManagedLimitMB() > 0) {
      return __(`Host up to %percent% of my drive (%limit% GB)`, {
        percent: `${Math.round((Math.floor(getManagedLimitMB() / 1024) / Math.floor(totalMB / 1024)) * 100)}%`,
        limit: Math.floor(getManagedLimitMB() / 1024),
      });
    } else {
      return __(`Not now, my disk is almost full.`);
    }
  }

  function getManagedHelper() {
    if (viewHostingLimit || autoHostingLimit || !saveBlobs) {
      return __(`We've noticed you already have some settings.`);
    } else if (getManagedLimitMB() > 0) {
      return __(`Donate space without filling up your drive.`);
    } else {
      return __(`You can clear some space and check hosting settings later.`);
    }
  }

  async function handleAuto() {
    if (viewHostingLimit || autoHostingLimit || !saveBlobs) {
      handleDone();
    } else if (getManagedLimitMB() > 0) {
      // limit to used // maybe move this to a single action function that doesn't live inside the component.
      await setDaemonSetting(DAEMON_SETTINGS.BLOB_STORAGE_LIMIT_MB, getViewedLimit());
      await setDaemonSetting(DAEMON_SETTINGS.NETWORK_STORAGE_LIMIT_MB, getAutoLimit());
      handleDone();
    } else {
      // running low on space
      handleDone();
    }
  }

  return (
    <section className="main--contained">
      <div className={'columns first-run__wrapper'}>
        <div className={'first-run__left'}>
          <div>
            <h1 className="section__title--large">{__('Hosting')}</h1>
            <h3 className="section__subtitle">
              {__('Help creators and improve the P2P data network by hosting content.')}
            </h3>
            <fieldset>
              <FormField
                name={'managedhosting'}
                type="radio"
                checked={hostingChoice === 'MANAGED'}
                label={getManagedCopy()}
                helper={getManagedHelper()}
                onChange={(e) => setHostingChoice('MANAGED')}
              />
              <FormField
                name={'customhosting'}
                type="radio"
                checked={hostingChoice === 'CUSTOM'}
                label={<>{__('Custom')}</>}
                helper={__(`You choose how much data to host.`)}
                onChange={(e) => setHostingChoice('CUSTOM')}
              />
            </fieldset>
          </div>
          <Form onSubmit={handleSubmit} className="section__body">
            <div className={'card__actions'}>
              <Button button="primary" label={hostingChoice === 'CUSTOM' ? __('Next') : __(`Let's go`)} type="submit" />
            </div>
          </Form>
        </div>
        <div className={'first-run__image-wrapper'}>
          <img src={image} className="privacy-img" />
        </div>
      </div>
    </section>
  );
}

export default withRouter(HostingSplash);
