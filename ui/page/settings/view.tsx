import * as React from "react";
import Page from "component/page";
import SettingAccount from "component/settingAccount";
import SettingAppearance from "component/settingAppearance";
import SettingContent from "component/settingContent";
import SettingSystem from "component/settingSystem";
import SettingStorage from "component/settingStorage";

type DaemonSettings = {
  download_dir: string;
  share_usage_data: boolean;
};

type Props = {
  daemonSettings: DaemonSettings;
  enterSettings: () => void;
  exitSettings: () => void;
};

class SettingsPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { enterSettings } = this.props;
    enterSettings();
  }

  componentWillUnmount() {
    const { exitSettings } = this.props;
    exitSettings();
  }

  render() {
    const { daemonSettings } = this.props;
    const noDaemonSettings = !daemonSettings || Object.keys(daemonSettings).length === 0;

    return (
      <Page
        noFooter
        settingsPage
        noSideNavigation
        // @ts-expect-error - TS2741 (ts-migration)
        backout={{ title: __("Settings"), backLabel: __("Back") }}
        className="card-stack"
      >
        {noDaemonSettings ? (
          <section className="card card--section">
            <div className="card__title card__title--deprecated">{__("Failed to load settings.")}</div>
          </section>
        ) : (
          <div className={"card-stack"}>
            {/* @ts-expect-error - TS2739 (ts-migration) */}
            <SettingAppearance />
            {/* @ts-expect-error - TS2739 (ts-migration) */}
            <SettingAccount />
            {/* @ts-expect-error - TS2740 (ts-migration) */}
            <SettingContent />
            {/* @ts-expect-error - TS2740 (ts-migration) */}
            <SettingSystem />
            {/* @ts-expect-error - TS2739 (ts-migration) */}
            <SettingStorage />
          </div>
        )}
      </Page>
    );
  }
}

export default SettingsPage;
