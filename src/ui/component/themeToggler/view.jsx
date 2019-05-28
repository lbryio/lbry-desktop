// @flow
import * as ICONS from 'constants/icons';
import * as SETTINGS from 'constants/settings';
import * as React from 'react';
import Button from 'component/button';

type Props = {
  // getThemes: () => void,
  // themes: Array<string>,
  currentTheme: string,
  automaticDarkModeEnabled: boolean,
  setClientSetting: (string, SetDaemonSettingArg) => void,
};

class ThemeToggler extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).onThemeToggle = this.onThemeToggle.bind(this);
  }

  // componentDidMount() {
  //   this.props.getThemes();
  // }

  onThemeToggle() {
    const { currentTheme, automaticDarkModeEnabled } = this.props;

    if (automaticDarkModeEnabled) {
      this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false);
      this.props.setClientSetting(SETTINGS.THEME, 'dark');
    } else if (currentTheme === 'dark') {
      this.props.setClientSetting(SETTINGS.THEME, 'light');
    } else if (currentTheme === 'light') {
      this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, true);
    }

    // Support more than two themes
    // if (automaticDarkModeEnabled) {
    //   this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, false);
    //   this.props.setClientSetting(SETTINGS.THEME, 'dark');
    // } else if (currentTheme === 'light') {
    //   this.props.setClientSetting(SETTINGS.AUTOMATIC_DARK_MODE_ENABLED, true);
    // } else {
    //   const nextThemeIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    //   this.props.setClientSetting(SETTINGS.THEME, themes[nextThemeIndex]);
    // }
  }

  render() {
    const { currentTheme, automaticDarkModeEnabled } = this.props;

    return (
      <Button
        className="header__navigation-item header__navigation-item--right-action"
        activeClass="header__navigation-item--active"
        description={__('Toggle themes')}
        title={
          (automaticDarkModeEnabled && 'Auto') ||
          (currentTheme === 'dark' && 'Dark') ||
          (currentTheme === 'light' && 'Light') ||
          'Others'
        }
        icon={
          (automaticDarkModeEnabled && ICONS.AUTO) ||
          (currentTheme === 'dark' && ICONS.DARK) ||
          (currentTheme === 'light' && ICONS.LIGHT) ||
          ICONS.VIEW
        }
        iconSize={24}
        onClick={this.onThemeToggle}
      />
    );
  }
}

export default ThemeToggler;
