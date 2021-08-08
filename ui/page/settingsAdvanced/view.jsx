// @flow
import * as React from 'react';

import Page from 'component/page';
import Card from 'component/common/card';

type Price = {
  currency: string,
  amount: number,
};

type SetDaemonSettingArg = boolean | string | number | Price;

type DaemonSettings = {
  download_dir: string,
  share_usage_data: boolean,
  max_key_fee?: Price,
  max_connections_per_download?: number,
  save_files: boolean,
  save_blobs: boolean,
  ffmpeg_path: string,
};

type Props = {
  daemonSettings: DaemonSettings,
  encryptWallet: () => void,
  decryptWallet: () => void,
  updateWalletStatus: () => void,
  walletEncrypted: boolean,
  confirmForgetPassword: ({}) => void,
  syncEnabled: boolean,
  enterSettings: () => void,
  exitSettings: () => void,
};

type State = {
  clearingCache: boolean,
};

class SettingsAdvancedPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      clearingCache: false,
    };
  }

  componentDidMount() {
    const { enterSettings } = this.props;
    enterSettings();
  }

  componentWillUnmount() {
    const { exitSettings } = this.props;
    exitSettings();
  }

  setDaemonSetting(name: string, value: ?SetDaemonSettingArg): void {
    // this.props.setDaemonSetting(name, value);
  }

  render() {
    const { daemonSettings } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    return (
      <Page
        noFooter
        noSideNavigation
        backout={{
          title: __('Advanced settings'),
          backLabel: __('Done'),
        }}
        className="card-stack"
      >
        {!IS_WEB && noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__('Failed to load settings.')}</div>
          </section>
        ) : (
          <div>
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsAdvancedPage;
