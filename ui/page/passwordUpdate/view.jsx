// @flow
import React from 'react';
// import Card from 'component/common/card';
import Page from 'component/page';
// import SettingAccountPassword from 'component/settingAccountPassword';

// insert setting card into page
export default function PasswordUpdate() {
  return <Page noFooter noSideNavigation settingsPage backout={{ title: __('Password'), backLabel: __('Back') }} />;
}
