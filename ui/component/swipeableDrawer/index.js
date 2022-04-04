import { connect } from 'react-redux';
import SwipeableDrawer from './view';
import { selectTheme } from 'redux/selectors/settings';
import { selectAppDrawerOpen } from 'redux/selectors/app';
import { doToggleAppDrawer } from 'redux/actions/app';

const select = (state) => ({
  open: selectAppDrawerOpen(state),
  theme: selectTheme(state),
});

const perform = {
  toggleDrawer: doToggleAppDrawer,
};

export default connect(select, perform)(SwipeableDrawer);
