import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { doUpdateBlockHeight, doError, SETTINGS } from 'lbry-redux';
import { doToggleEnhancedLayout } from 'redux/actions/app';
import { selectUser } from 'lbryinc';
import { selectThemePath, makeSelectClientSetting } from 'redux/selectors/settings';
import { selectEnhancedLayout } from 'redux/selectors/app';
import App from './view';

const select = state => ({
  user: selectUser(state),
  theme: selectThemePath(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
  enhancedLayout: selectEnhancedLayout(state),
});

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  updateBlockHeight: () => dispatch(doUpdateBlockHeight()),
  toggleEnhancedLayout: () => dispatch(doToggleEnhancedLayout()),
});

export default hot(
  connect(
    select,
    perform
  )(App)
);
