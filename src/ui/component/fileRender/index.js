import { connect } from 'react-redux';
import { THEME } from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import FileRender from './view';

const select = state => ({
  currentTheme: makeSelectClientSetting(THEME)(state),
});

export default connect(select)(FileRender);
