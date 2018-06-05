import { connect } from 'react-redux';
import { THEME } from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import FileRender from './view';

const select = (state, props) => ({
  currentTheme: makeSelectClientSetting(THEME)(state),
});

const perform = dispatch => ({});

export default connect(
  select,
  perform
)(FileRender);
